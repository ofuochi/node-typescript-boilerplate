export interface SignUpInput {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
}
export interface SignInInput {
    emailOrUsername: string;
    password: string;
}
export interface UserDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
}
