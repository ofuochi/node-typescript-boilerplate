import {
    UserDto,
    UserSignInInput,
    UserSignUpInput
} from "../../../ui/models/user_dto";

export interface IAuthService {
    signUp(
        signUpInput: UserSignUpInput
    ): Promise<{ userDto: UserDto; token: string }>;
    signIn(signInInput: UserSignInInput): Promise<{ token: string }>;
}
