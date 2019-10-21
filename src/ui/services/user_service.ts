import bcrypt from "bcrypt";
import { plainToClass } from "class-transformer";
import httpStatus from "http-status-codes";
import { IUserRepository } from "../../domain/interfaces/repositories";
import { PASSWORD_SALT_ROUND, User } from "../../domain/model/user";
import { config } from "../../infrastructure/config";
import { inject, provideSingleton } from "../../infrastructure/config/ioc";
import { UserRepository } from "../../infrastructure/db/repositories/user_repository";
import { HttpError } from "../error";
import { IUserService } from "../interfaces/user_service";
import { UserDto, UserSignUpInput } from "../models/user_dto";

@provideSingleton(UserService)
export class UserService implements IUserService {
    @inject(UserRepository) private readonly _userRepository: IUserRepository;

    async create(user: UserSignUpInput): Promise<UserDto> {
        let newUser = await this._userRepository.findOneByQuery({
            email: user.email
        });
        if (newUser)
            throw new HttpError(
                httpStatus.CONFLICT,
                `User with email "${newUser.email}" already exist`
            );

        newUser = await this._userRepository.findOneByQuery({
            username: user.username
        });

        if (newUser)
            throw new HttpError(
                httpStatus.CONFLICT,
                `User with username "${newUser.username}" already exist`
            );

        const saltRound =
            config.env === "development" || config.env === "test"
                ? 1
                : PASSWORD_SALT_ROUND;
        user.password = await bcrypt.hash(user.password, saltRound);

        newUser = User.createInstance({ ...user });

        await this._userRepository.insertOrUpdate(newUser);

        return plainToClass(UserDto, newUser, {
            enableImplicitConversion: true,
            excludeExtraneousValues: true
        });
    }
    async get(id: string): Promise<UserDto> {
        const user = await this._userRepository.findById(id);
        return plainToClass<UserDto, User>(UserDto, user, {
            enableImplicitConversion: true,
            excludeExtraneousValues: true
        });
    }
    async getAll(): Promise<UserDto[]> {
        const users = await this._userRepository.findAll();
        return plainToClass<UserDto, User>(UserDto, users, {
            enableImplicitConversion: true,
            excludeExtraneousValues: true
        });
    }

    async update(user: Partial<User>): Promise<void> {
        const userToUpdate = await this._userRepository.findById(user.id);
        if (!userToUpdate)
            throw new HttpError(
                httpStatus.NOT_FOUND,
                `User with ID "${user.id}" does not exist`
            );

        // check that userToUpdate does not overwrite an existing email or username
        let existingUser: User;
        if (user.email) {
            existingUser = await this._userRepository.findOneByQuery({
                email: user.email
            });
            if (existingUser)
                throw new HttpError(
                    httpStatus.CONFLICT,
                    `User with email "${user.email}" already exist`
                );
        }
        if (user.username) {
            existingUser = await this._userRepository.findOneByQuery({
                username: user.username
            });
            if (existingUser)
                throw new HttpError(
                    httpStatus.CONFLICT,
                    `User with username "${user.username}" already exist`
                );
        }
        userToUpdate.update(user);
        await this._userRepository.insertOrUpdate(userToUpdate);
    }
    async delete(id: string): Promise<boolean> {
        return this._userRepository.deleteById(id);
    }
}
