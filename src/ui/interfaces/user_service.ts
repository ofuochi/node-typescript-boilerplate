import { UserDto, UserSignUpInput } from "../models/user_dto";
import { User } from "../../domain/model/user";
import { IBaseService } from "./base_service";

export interface IUserService extends IBaseService<User> {
    create(user: UserSignUpInput): Promise<User>;
    get(id: string): Promise<User>;
    getAll(): Promise<User[]>;

    update(user: Partial<UserDto>): Promise<void>;
    delete(id: string): Promise<boolean>;
}
