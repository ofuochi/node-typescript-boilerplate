import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import * as querystring from "querystring";

import {
	ConflictException,
	Injectable,
	NotFoundException,
	Scope
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { ConfigService } from "../config/config.service";
import { Query } from "../db/interfaces/repo.interface";
import { TempPwResetRepository } from "../db/repos/pw_reset.repo";
import { TempPasswordReset } from "../entities/pw_reset.entity";
import { UserRepository } from "../user/repository/user.repository";
import { User, UserRole } from "../user/user.entity";
import { hashPw } from "../utils/pwHash";
import { errors } from "./constants/error.constant";
import { CallbackUrlPropsInput } from "./dto/CallbackUrlPropsInput";
import { MailService } from "../shared/services/mail.service";

export interface DecodedJwt {
	username: string;
	sub: string;
	roles: UserRole[];
	tenant: any;
}

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
	constructor(
		private readonly _jwtService: JwtService,
		private readonly _userRepository: UserRepository,
		private readonly _tempPwResetRepository: TempPwResetRepository,
		private readonly _configService: ConfigService,
		private readonly _mailService: MailService
	) {}
	/**
	 * Checks if a User exist and returns the User
	 *
	 * @param {string} emailOrUsername
	 * @param {string} pw
	 * @returns {Promise<User>}
	 * @memberof AuthService
	 */
	async validateUser(emailOrUsername: string, pw: string): Promise<User> {
		const user = await this.getUserRecord(emailOrUsername);
		await this.processSignInAttempt(pw, user);
		const { password, ...result } = user;
		return result as User;
	}

	/**
	 * Generates JWT access token
	 *
	 * @param {User} user
	 * @returns {Promise<{ access_token: string }>}
	 * @memberof AuthService
	 */
	async generateJwt(user: User): Promise<{ access_token: string }> {
		const payload: DecodedJwt = {
			username: user.username,
			sub: user.id,
			roles: user.roles,
			tenant: user.tenant
		};
		return {
			access_token: this._jwtService.sign(payload)
		};
	}

	/**
	 * Registers a new user
	 *
	 * @param {User} user
	 * @returns {Promise<{ canLogin: boolean; access_token: string }>}
	 * @memberof AuthService
	 */
	async register(
		user: User
	): Promise<{ canLogin: boolean; access_token: string }> {
		let existingUser = await this._userRepository.findOneByQuery({
			email: user.email
		});
		if (existingUser) {
			throw new ConflictException(
				`User with email ${user.email} already exists`
			);
		}
		existingUser = await this._userRepository.findOneByQuery({
			username: user.username
		});
		if (existingUser) {
			throw new ConflictException(
				`User with username ${user.username} already exists`
			);
		}
		user.setPassword(await hashPw(user.password));
		await this._userRepository.insertOrUpdate(user);
		const { access_token } = await this.generateJwt(user);
		return { canLogin: !!access_token, access_token };
	}

	async sendPasswordResetToken(input: CallbackUrlPropsInput) {
		const user = await this._userRepository.findOneByQuery({
			email: input.email
		});
		if (!user) throw new NotFoundException(`${input.email} does not exist!`);
		const randomToken = crypto.randomBytes(20).toString("hex");
		let pwResetEntity = await this._tempPwResetRepository.findOneByQuery({
			user: user.id
		});
		if (!pwResetEntity)
			pwResetEntity = TempPasswordReset.createInstance(user.id, randomToken);
		await this._tempPwResetRepository.insertOrUpdate(pwResetEntity);
		let callbackUrl = querystring.stringify({
			[input.emailParameterName]: input.emailParameterName,
			[input.verificationCodeParameterName]: input.verificationCodeParameterName
		});

		callbackUrl = `${input.clientBaseUrl}/?${callbackUrl}`;
		this._mailService.sendMail("from@gmail.com", "to@gmail.com", callbackUrl);
	}
	//#region
	private async processSignInAttempt(pw: string, user: User) {
		if (!user) {
			throw errors.INVALID_LOGIN_ATTEMPT;
		}
		if (user.isLockedOut(this._configService.env.maxLoginAttempts)) {
			throw errors.ACCOUNT_LOCKED_OUT;
		}
		const isPasswordValid = await bcrypt.compare(pw, user.password);

		if (!isPasswordValid) {
			throw errors.INVALID_LOGIN_ATTEMPT;
		}

		// clear the signin attempts of the user and lockout end date
		user.clearLockOut();
		await this._userRepository.insertOrUpdate(user);
	}
	private async getUserRecord(emailOrUsername: string): Promise<User> {
		const user = await this._userRepository.findOneByQuery({
			$or: [{ email: emailOrUsername }, { username: emailOrUsername }]
		} as any);
		if (
			user &&
			user.failedSignInAttempts >= this._configService.env.maxLoginAttempts &&
			user.lockOutEndDate.getTime() >= Date.now()
		) {
			throw errors.ACCOUNT_LOCKED_OUT;
		}
		// increase the user's signin attempt for every of this call if the user is not yet locked
		return this._userRepository.findOneByQueryAndUpdate(
			this.getSignInQuery(emailOrUsername),
			User.getSignInAttemptUpdate(
				this._configService.env.lockoutDurationMinutes
			)
		);
	}
	private getSignInQuery(
		emailOrUsername: string
	): Query<{ [key: string]: object }> {
		return {
			$and: [
				{ $or: [{ email: emailOrUsername }, { username: emailOrUsername }] },
				{
					$or: [
						{
							failedSignInAttempts: {
								$lt: this._configService.env.maxLoginAttempts
							}
						},
						{
							lockOutEndDate: { $lt: new Date() }
						}
					]
				}
			]
		};
	}
	//#endregion
}
