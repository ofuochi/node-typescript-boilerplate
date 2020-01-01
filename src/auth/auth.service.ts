import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import * as querystring from "querystring";

import {
	ConflictException,
	Injectable,
	NotFoundException,
	Scope,
	UnauthorizedException
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { ConfigService } from "../config/config.service";
import { Query } from "../db/interfaces/repo.interface";
import { TempPwResetRepository } from "../db/repos/pw_reset.repo";
import { TempToken } from "../shared/entities/temp_token.entity";
import { UserRepository } from "../user/repository/user.repository";
import { User, UserRole } from "../user/user.entity";
import { hashPassword } from "../shared/utils/pwHash";
import { errors } from "./constants/error.constant";
import { CallbackUrlPropsInput } from "./dto/CallbackUrlPropsInput";
import { MailService } from "../shared/services/mail.service";
import { PasswordResetInput } from "./dto/PasswordResetInput";
import { VerificationInput } from "./dto/VerificationInput";

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
		private readonly _tempTokenRepository: TempPwResetRepository,
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
		const access_token = await this._jwtService.signAsync(payload);
		return { access_token };
	}

	/**
	 * Decode JWT
	 *
	 * @param {string} jwt
	 * @returns
	 * @memberof AuthService
	 */
	async decodeJwt(jwt: string) {
		return this._jwtService.decode(jwt) as DecodedJwt;
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
		const hashedPassword = await hashPassword(user.password);

		user.setPassword(hashedPassword);
		await this._userRepository.insertOrUpdate(user);
		const { access_token } = await this.generateJwt(user);
		return { canLogin: !!access_token, access_token };
	}
	async sendEmailVerificationToken(input: CallbackUrlPropsInput) {
		await this.sendToken(input);
	}
	async sendPasswordResetToken(input: CallbackUrlPropsInput) {
		await this.sendToken(input);
	}

	async resetPassword(input: PasswordResetInput) {
		const { token, newPassword, email } = input;
		const user = await this.validateUserByEmail(email);
		await this.validateToken(user.id, token);

		const hashedPw = await hashPassword(newPassword);
		user.setPassword(hashedPw);

		await this._userRepository.insertOrUpdate(user);
		await this._tempTokenRepository.deleteOneByQuery({ user: user.id });
	}
	async verifyUserEmail(input: VerificationInput) {
		const { token, email } = input;
		const user = await this.validateUserByEmail(email);
		await this.validateToken(user.id.toString(), token);
		user.verifyEmail();
		await this._userRepository.insertOrUpdate(user);
		await this._tempTokenRepository.deleteOneByQuery({ user: user.id });
	}

	//#region
	private async validateToken(user: User, token: string) {
		const tempPw = await this._tempTokenRepository.findOneByQuery({
			user: user.id
		});
		if (!tempPw)
			throw new NotFoundException(
				"Token has expired! Re-send password reset token."
			);
		const isCorrectToken = await bcrypt.compare(token, tempPw.token);
		if (!isCorrectToken) throw new UnauthorizedException("Invalid token!");
	}

	private async validateUserByEmail(email: string) {
		const user = await this._userRepository.findOneByQuery({ email });
		if (!user) throw new NotFoundException(`${email} was not found!`);
		return user;
	}
	private async sendToken(input: CallbackUrlPropsInput) {
		const user = await this._userRepository.findOneByQuery({
			email: input.email
		});
		if (!user) throw new NotFoundException(`${input.email} does not exist!`);
		const tokenToSend = crypto.randomBytes(32).toString("hex");
		const tokenToSave = await hashPassword(tokenToSend);
		let pwResetEntity = await this._tempTokenRepository.findOneByQuery({
			user: user.id
		});
		if (!pwResetEntity)
			pwResetEntity = TempToken.createInstance(user.id, tokenToSave);
		await this._tempTokenRepository.insertOrUpdate(pwResetEntity);
		let callbackUrl = querystring.stringify({
			[input.emailParameterName]: input.email,
			[input.verificationCodeParameterName]: tokenToSend
		});
		callbackUrl = `${input.clientBaseUrl}/?${callbackUrl}`;
		this._mailService.sendMail(
			this._configService.env.appEmail,
			input.email,
			callbackUrl
		);
	}
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
