import bcrypt from "bcrypt";
import { EventDispatcher } from "event-dispatch";
import httpStatus from "http-status-codes";
import { injectable } from "inversify";
import jwt from "jsonwebtoken";

import {
    eventDispatcher,
    userRepository
} from "../../domain/constants/decorators";
import { IUserRepository } from "../../domain/interfaces/repositories";
import { User, UserRole } from "../../domain/model/user";
import config from "../../infrastructure/config";
import { IAuthService } from "../interfaces/auth_service";
import events from "../subscribers/events";
import { HttpError } from "../error";
import { UserDto, UserSignInInput, UserSignUpInput } from "../models/user_dto";

export interface DecodedJwt {
    userId: string;
    role: UserRole;
    email: string;
    username: string;
    firstName: string;
    tenantId: any;
}
@injectable()
export default class AuthService implements IAuthService {
    @userRepository private _userRepository: IUserRepository;
    @eventDispatcher private _eventDispatcher: EventDispatcher;

    public async signUp(
        dto: UserSignUpInput
    ): Promise<{ user: UserDto; token: string }> {
        // Use less salt round for faster hashing on test and development but stronger hashing on production
        const hashedPassword =
            config.env === "development" || config.env === "test"
                ? await bcrypt.hash(dto.password, 1)
                : await bcrypt.hash(dto.password, 12);

        let userRecord = await this._userRepository.findOneByQuery({
            email: dto.email,
            tenant: global.currentUser.tenant.id
        });
        if (userRecord) throw new HttpError(httpStatus.CONFLICT);

        const userInstance = User.createInstance({
            ...dto,
            password: hashedPassword
        });

        userRecord = await this._userRepository.save(userInstance);
        userInstance.id = userRecord.id;
        userInstance.setCreator(userRecord);
        await this._userRepository.save(userInstance);
        global.currentUser.setUser(userInstance);

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
            return this._userRepository.findOneByQuery({
                email: emailOrUsername,
                tenant: global.currentUser.tenant.id
            });

        return this._userRepository.findOneByQuery({
            username: emailOrUsername,
            tenant: global.currentUser.tenant.id
        });
    }

    private async generateToken(user: User) {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);

        const payload: DecodedJwt = {
            userId: user.id,
            role: user.role,
            email: user.email,
            username: user.username,
            firstName: user.firstName,
            tenantId: user.tenant
        };
        return jwt.sign(payload, config.jwtSecret, { expiresIn: "2 days" });
    }
}
