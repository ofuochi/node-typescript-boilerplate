import { SignUpInput, UserDto, SignInInput } from "../models/user_dto";

export interface IAuthService {
    signUp(signUpInput: SignUpInput): Promise<{ user: UserDto; token: string }>;
    signIn(signInInput: SignInInput): Promise<{ token: string }>;
}
