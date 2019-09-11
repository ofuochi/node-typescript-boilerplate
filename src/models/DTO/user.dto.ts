export interface UserDto {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
}

export interface CreateUserInput {
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
}

export interface UserLoginInput {
    usernameOrEmail: string;
    password: string;
}
