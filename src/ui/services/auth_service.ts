import { AutoMapper } from "automapper-nartc";
import bcrypt from "bcrypt";
import { EventDispatcher } from "event-dispatch";
import httpStatus from "http-status-codes";
import { injectable } from "inversify";
import jwt from "jsonwebtoken";

import {
    autoMapper,
    eventDispatcher,
    userRepository
} from "../../domain/constants/decorators";
import { IUserRepository } from "../../domain/interfaces/repositories";
import { User, UserRole } from "../../domain/model/user";
import { config } from "../../infrastructure/config";
import { HttpError } from "../error";
import { IAuthService } from "../interfaces/auth_service";
import { UserDto, UserSignInInput, UserSignUpInput } from "../models/user_dto";
import { events } from "../subscribers/events";

export interface DecodedJwt {
    userId: string;
    role: UserRole;
    email: string;
    username: string;
    firstName: string;
    tenantId: any;
}
@injectable()
export class AuthService implements IAuthService {
    @userRepository private _userRepository: IUserRepository;
    @eventDispatcher private _eventDispatcher: EventDispatcher;
    @autoMapper private _autoMapper: AutoMapper;

    public async signUp(
        dto: UserSignUpInput
    ): Promise<{ userDto: UserDto; token: string }> {
        // Use less salt round for faster hashing on test and development but stronger hashing on production
        const hashedPassword =
            config.env === "development" || config.env === "test"
                ? await bcrypt.hash(dto.password, 1)
                : await bcrypt.hash(dto.password, 12);

        let user = await this._userRepository.findOneByQuery({
            email: dto.email,
            tenant: global.currentUser.tenant.id
        });
        if (user) throw new HttpError(httpStatus.CONFLICT);

        user = await this._userRepository.save(
            User.createInstance({
                ...dto,
                password: hashedPassword
            })
        );

        global.currentUser.setUser(user);
        this._eventDispatcher.dispatch(events.user.signUp, { ...dto });

        const token = await this.generateToken(user);
        const userDto = this._autoMapper.map(user, UserDto);
        return { userDto, token };
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
