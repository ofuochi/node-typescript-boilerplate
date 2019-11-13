import * as bcrypt from 'bcrypt'
import { ConflictException, Injectable, Scope } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { ConfigService } from '../config/config.service'
import { Query } from '../db/interfaces/repo.interface'
import { UserRepository } from '../user/repository/user.repository'
import { User, UserRole } from '../user/user.entity'
import { hashPw } from '../utils/pwHash'
import { errors } from './constants/error.constant'
import { Temp_PasswordReset } from '../entities/pw_reset.entity'

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
		private readonly _configService: ConfigService
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
	 * @returns {Promise<{ id: string; canLogin: boolean; access_token: string }>}
	 * @memberof AuthService
	 */
	async register(
		user: User
	): Promise<{ id: string; canLogin: boolean; access_token: string }> {
		// const pwReset = Temp_PasswordReset.createInstance(
		// 	"5dcc12d39b94ad1d6afa3b3f",
		// 	"string"
		// );
		// console.info(pwReset);
		// const res = await Temp_PasswordReset.getModel().create(pwReset);
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
		const newUser = await this._userRepository.insertOrUpdate(user);
		const { access_token } = await this.generateJwt(user);
		return { canLogin: !!access_token, access_token, id: newUser.id };
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
