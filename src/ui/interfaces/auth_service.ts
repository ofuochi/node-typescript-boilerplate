import { UserDto, UserSignInInput, UserSignUpInput } from '../models/user_dto'

export interface IAuthService {
    signUp(
        signUpInput: UserSignUpInput
    ): Promise<{ user: UserDto; token: string }>;
    signIn(signInInput: UserSignInInput): Promise<{ token: string }>;
}
