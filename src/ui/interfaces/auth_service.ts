import { SignUpInput, UserDto } from "../models/user_dto";

export interface IAuthService {
    signUp(user: SignUpInput): Promise<{ user: UserDto; token: string }>;
    signIn(
        emailOrUsername: string,
        password: string
    ): Promise<{ token: string }>;
}
