import { UserDto, UserSignUpInput } from "../models/user_dto";

export interface IUserService {
    create(user: UserSignUpInput): Promise<UserDto>;
    get(id: string): Promise<UserDto>;
    update(user: Partial<UserDto>): Promise<void>;
    delete(id: string): Promise<boolean>;
}
