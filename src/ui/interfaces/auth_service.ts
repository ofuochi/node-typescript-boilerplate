import { User } from "../../domain/model/user";

export interface IAuthService {
    signUp(user: User): Promise<{ user: User; token: string }>;
    signIn(
        emailOrUsername: string,
        password: string
    ): Promise<{ user: User; token: string }>;
}
