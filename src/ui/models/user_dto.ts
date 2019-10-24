import { Expose } from "class-transformer";
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    IsOptional
} from "class-validator";
import { MAX_NAME_LENGTH } from "../../core/domain/models/user";
import { BaseEntityDto } from "./base_dto";

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
export class UserDto extends BaseEntityDto {
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @Expose()
    firstName: string;
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @Expose()
    lastName: string;
    @MaxLength(MAX_NAME_LENGTH)
    @IsEmail()
    @IsOptional()
    @Expose()
    email: string;
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @Expose()
    username: string;
}
export class UserUpdateInput {
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @Expose()
    firstName?: string;
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @Expose()
    lastName?: string;
    @MaxLength(MAX_NAME_LENGTH)
    @IsEmail()
    @IsOptional()
    @Expose()
    email?: string;
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    @IsOptional()
    @IsString()
    @Expose()
    username?: string;
}
