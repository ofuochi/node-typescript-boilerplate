import bcrypt from "bcrypt";
import { plainToClass } from "class-transformer";
import { EventDispatcher } from "event-dispatch";
import httpStatus from "http-status-codes";
import jwt from "jsonwebtoken";
import { eventDispatcher } from "../../domain/constants/decorators";
import { IUserRepository } from "../../domain/interfaces/repositories";
import { User, UserRole } from "../../domain/model/user";
import { config } from "../../infrastructure/config";
import { inject, provideSingleton } from "../../infrastructure/config/ioc";
import { UserRepository } from "../../infrastructure/db/repositories/user_repository";
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
@provideSingleton(AuthService)
export class AuthService implements IAuthService {
    @inject(UserRepository) private _userRepository: IUserRepository;
    @eventDispatcher private _eventDispatcher: EventDispatcher;

    public async signUp(
        dto: UserSignUpInput
    ): Promise<{ userDto: UserDto; token: string }> {
        // Check that user is not already signed in
        if (global.currentUser && global.currentUser.decodedJwt)
            throw new HttpError(httpStatus.CONFLICT, "You are still signed in");

        // Use less salt round for faster hashing on test and development but stronger hashing on production
        const hashedPassword =
            config.env === "development" || config.env === "test"
                ? await bcrypt.hash(dto.password, 1)
                : await bcrypt.hash(dto.password, 12);
        const tenantId = global.currentUser.tenant.id;
        let user = await this._userRepository.findOneByQuery({
            email: dto.email,
            tenant: tenantId
        });
        if (user)
            throw new HttpError(
                httpStatus.CONFLICT,
                `Email "${dto.email.toLowerCase()}" is already taken`
            );
        user = await this._userRepository.findOneByQuery({
            username: dto.username,
            tenant: tenantId
        });
        if (user)
            throw new HttpError(
                httpStatus.CONFLICT,
                `Username "${dto.username.toLowerCase()}" is already taken`
            );
        user = await this._userRepository.insertOrUpdate(
            User.createInstance({
                ...dto,
                password: hashedPassword
            })
        );

        this._eventDispatcher.dispatch(events.user.signUp, { ...dto });

        global.currentUser.setUser(user);
        const token = await this.generateToken(user);
        const userDto = plainToClass(UserDto, user, {
            enableImplicitConversion: true,
            excludeExtraneousValues: true
        });
        return { userDto, token };
    }

    public async signIn(dto: UserSignInInput): Promise<{ token: string }> {
        const user = await this.getUserRecord(dto.emailOrUsername);

        if (!user)
            throw new HttpError(
                httpStatus.UNAUTHORIZED,
                "Invalid login attempt!"
            );

        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.password
        );
        if (!isPasswordValid)
            throw new HttpError(
                httpStatus.UNAUTHORIZED,
                "Invalid login attempt!"
            );

        const token = await this.generateToken(user);
        return { token };
    }

    private async getUserRecord(emailOrUsername: string): Promise<User> {
        const tenantId = global.currentUser.tenant.id;
        if (emailOrUsername.includes("@"))
            return this._userRepository.findOneByQuery({
                email: emailOrUsername,
                tenant: tenantId
            });

        return this._userRepository.findOneByQuery({
            username: emailOrUsername,
            tenant: tenantId
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
        global.currentUser.setUser(user);
        global.currentUser.setDecodedJwt(payload);
        return jwt.sign(payload, config.jwtSecret, { expiresIn: "2 days" });
    }
}
