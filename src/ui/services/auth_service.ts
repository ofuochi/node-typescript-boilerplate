import bcrypt from "bcrypt";
import httpStatus from "http-status-codes";
import jwt from "jsonwebtoken";
import { EventDispatcher } from "event-dispatch";
import { injectable } from "inversify";

import config from "../../infrastructure/config";
import events from "../subscribers/events";
import {
    eventDispatcher,
    userRepository
} from "../../domain/constants/decorators";
import { TYPES } from "../../domain/constants/types";
import { IUserRepository } from "../../domain/interfaces/repositories";
import { User } from "../../domain/model/user";
import { IAuthService } from "../interfaces/auth_service";
import { HttpError } from "./../error";
import {
    UserDto,
    UserSignInInput,
    UserSignUpInput
} from "./../models/user_dto";

@injectable()
export default class AuthService implements IAuthService {
    @userRepository private _userRepository: IUserRepository;
    @eventDispatcher private _eventDispatcher: EventDispatcher;

    public async signUp(
        dto: UserSignUpInput
    ): Promise<{ user: UserDto; token: string }> {
        try {
            // Use less salt round for faster hashing on test or development but stronger hashing on production
            const hashedPassword =
                config.env === "development" || "test"
                    ? await bcrypt.hash(dto.password, 1)
                    : await bcrypt.hash(dto.password, 12);

            let userRecord = await this._userRepository.findOneByQuery({
                email: dto.email
            });
            if (userRecord) throw new HttpError(httpStatus.CONFLICT);

            const userInstance = User.createInstance({
                ...dto,
                password: hashedPassword
            });
            userRecord = await this._userRepository.save(userInstance);
            const userDto: UserDto = {
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: userRecord.email,
                username: userRecord.username,
                id: userRecord.id
            };
            this._eventDispatcher.dispatch(events.user.signUp, { ...dto });
            const token = await this.generateToken(userRecord);
            return { user: userDto, token };
        } catch (e) {
            throw e;
        }
    }

    public async signIn(dto: UserSignInInput): Promise<{ token: string }> {
        const user = await this.getUserRecord(dto.emailOrUsername);

        if (!user)
            throw new HttpError(
                httpStatus.BAD_REQUEST,
                "Invalid login attempt!"
            );

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.password
        );

        if (!isPasswordValid)
            throw new HttpError(
                httpStatus.BAD_REQUEST,
                "Invalid login attempt!"
            );

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
        return jwt.sign(
            {
                id: user.id,
                role: user.role,
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
