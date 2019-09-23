import bcrypt from "bcrypt";
import { EventDispatcher } from "event-dispatch";
import { injectable } from "inversify";
import jwt from "jsonwebtoken";

import {
    eventDispatcher,
    loggerService,
    tenantRepository,
    userRepository
} from "../../domain/constants/decorators";
import {
    ITenantRepository,
    IUserRepository
} from "../../domain/interfaces/repositories";
import { ILoggerService } from "../../domain/interfaces/services";
import { User } from "../../domain/model/user";
import config from "../../infrastructure/config";
import { IAuthService } from "../interfaces/auth_service";
import events from "../subscribers/events";
import { SignUpInput, UserDto } from "./../models/user_dto";

@injectable()
export default class AuthService implements IAuthService {
    @userRepository private _userRepository: IUserRepository;
    @tenantRepository private _tenantRepository: ITenantRepository;
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

            this._logger.silly("Generating JWT");
            const token = await this.generateToken(userRecord);

            if (!userRecord) {
                throw new Error("User cannot be created");
            }
            this._logger.silly("Sending welcome email");

            this._eventDispatcher.dispatch(events.user.signUp, { ...dto });

            const userDto: UserDto = {
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: userRecord.email,
                username: userRecord.username,
                id: userRecord.id
            };
            return { user: userDto, token };
        } catch (e) {
            this._logger.error(e);
            throw e;
        }
    }

    public async signIn(
        emailOrUsername: string,
        password: string
    ): Promise<{ token: string }> {
        const userRecords = await this._userRepository.findManyByQuery({
            email: emailOrUsername
        });
        if (!userRecords) {
            throw new Error("User not registered");
        }

        /**
         * We use verify from argon2 to prevent 'timing based' attacks
         */
        this._logger.silly("Checking password");
        const userRecord = userRecords[0];
        const validPassword = await bcrypt.compare(
            userRecord.password,
            password
        );
        if (validPassword) {
            this._logger.silly("Password is valid!");
            this._logger.silly("Generating JWT");
            const token = await this.generateToken(userRecord);

            // const user = userRecord.toObject();
            //  Reflect.deleteProperty(user, "salt");
            /**
             * Easy as pie, you don't need passport.js anymore :)
             */
            return { token };
        } else {
            throw new Error("Invalid Password");
        }
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
                exp: exp.getTime() / 1000
            },
            config.jwtSecret
        );
    }
}
