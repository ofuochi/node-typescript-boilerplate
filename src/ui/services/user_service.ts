import bcrypt from "bcrypt";
import { plainToClass } from "class-transformer";
import { IUserRepository } from "../../domain/interfaces/repositories";
import { PASSWORD_SALT_ROUND, User } from "../../domain/model/user";
import { config } from "../../infrastructure/config";
import { inject, provideSingleton } from "../../infrastructure/config/ioc";
import { UserRepository } from "../../infrastructure/db/repositories/user_repository";
import { IUserService } from "../interfaces/user_service";
import { UserDto, UserSignUpInput } from "../models/user_dto";

@provideSingleton(UserService)
export class UserService implements IUserService {
    @inject(UserRepository) private readonly _userRepository: IUserRepository;

    async create(user: UserSignUpInput): Promise<UserDto> {
        const saltRound =
            config.env === "development" || config.env === "test"
                ? 1
                : PASSWORD_SALT_ROUND;
        const password = await bcrypt.hash(user.password, saltRound);
        user.password = password;

        const newUser = User.createInstance({ ...user });
        await this._userRepository.insertOrUpdate(newUser);

        return plainToClass(UserDto, newUser, {
            enableImplicitConversion: true,
            excludeExtraneousValues: true
        });
    }
    async get(id: string): Promise<UserDto> {
        const user = await this._userRepository.findById(id);
        return plainToClass(UserDto, user, {
            enableImplicitConversion: true,
            excludeExtraneousValues: true
        });
    }
    async update(user: Partial<UserDto>): Promise<void> {
        if (!user.id) throw new Error("User ID is missing");

        const userToUpdate = await this._userRepository.findById(user.id);
        if (!userToUpdate) throw new Error("User with given ID does not exist");

        userToUpdate.update(user);

        await this._userRepository.insertOrUpdate(userToUpdate);
    }
    async delete(id: string): Promise<void> {
        await this._userRepository.deleteById(id);
    }
}
