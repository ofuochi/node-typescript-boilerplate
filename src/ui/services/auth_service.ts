import bcrypt from "bcrypt";
import { EventDispatcher } from "event-dispatch";
import { injectable } from "inversify";
import jwt from "jsonwebtoken";

import {
    eventDispatcher,
    loggerService,
    userRepository
} from "../../domain/constants/decorators";
import { IUserRepository } from "../../domain/interfaces/repositories";
import { ILoggerService } from "../../domain/interfaces/services";
import { User } from "../../domain/model/user";
import config from "../../infrastructure/config";
import { IAuthService } from "../interfaces/auth_service";
import events from "../subscribers/events";
import { SignUpInput, UserDto, SignInInput } from "./../models/user_dto";

@injectable()
export default class AuthService implements IAuthService {
    @userRepository private _userRepository: IUserRepository;
    @eventDispatcher private _eventDispatcher: EventDispatcher;
    @loggerService private _logger: ILoggerService;

    public async signUp(
        dto: SignUpInput
    ): Promise<{ user: UserDto; token: string }> {
        try {
            const hashedPassword = await bcrypt.hash(dto.password, 10);
            const user = User.createInstance({
                ...dto,
                password: hashedPassword
            });
            const userRecord = await this._userRepository.save(user);
            const token = await this.generateToken(userRecord);

            const userDto: UserDto = {
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: userRecord.email,
                username: userRecord.username,
                id: userRecord.id
            };
            this._eventDispatcher.dispatch(events.user.signUp, { ...dto });
            return { user: userDto, token };
        } catch (e) {
            this._logger.error(e);
            throw e;
        }
    }

    public async signIn(dto: SignInInput): Promise<{ token: string }> {
        const user = await this.getUserRecord(dto.emailOrUsername);
        if (!user) throw new Error("Invalid login attempt!");

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.password
        );

        if (!isPasswordValid) throw new Error("Invalid login attempt!");

        const token = await this.generateToken(user);
        return { token };
    }

    private async getUserRecord(emailOrUsername: string): Promise<User> {
        if (emailOrUsername.includes("@"))
            return await this._userRepository.findOneByQuery({
                email: emailOrUsername
            });

        return await this._userRepository.findOneByQuery({
            username: emailOrUsername
        });
    }

    private async generateToken(user: User) {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);

        /**
         * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
         * The cool thing is that you can add custom properties a.k.a metadata
         * Here we are adding the userId, role and name
         * Beware that the metadata is public and can be decoded without _the secret_
         * but the client cannot craft a JWT to fake a userId
         * because it doesn't have _the secret_ to sign it
         * more information here: https://softwareontheroad.com/you-dont-need-passport
         */

        return jwt.sign(
            {
                id: user.id, // We are gonna use this in the middleware 'isAuth'
                roles: user.roles,
                email: user.email,
                username: user.username,
                firstName: user.firstName,
                tenantId: user.tenant,
                exp: exp.getTime() / 1000
            },
            config.jwtSecret
        );
    }
}
