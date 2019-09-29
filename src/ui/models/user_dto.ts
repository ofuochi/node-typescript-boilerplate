import { IsEmail, IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator'

import { MAX_NAME_LENGTH } from '../../domain/model/user'

export class UserSignUpInput {
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    @IsString()
    firstName: string;
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    @IsString()
    lastName: string;
    @IsEmail()
    email: string;
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    @IsString()
    username: string;
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    password: string;
}
export class UserSignInInput {
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    emailOrUsername: string;
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    password: string;
}
export interface UserSignUpDto {
    userDto: UserDto;
    token: string;
}
export class UserDto {
    @IsUUID()
    id: string;
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    @IsString()
    firstName: string;
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    @IsString()
    lastName: string;
    @MaxLength(MAX_NAME_LENGTH)
    @IsEmail()
    email: string;
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    @IsString()
    username: string;
}
