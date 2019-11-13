import { MAX_NAME_LENGTH } from "../user.entity";
import {
  MaxLength,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
} from "class-validator";
import { Expose } from "class-transformer";
import { BaseEntityDto } from "./BaseEntityDto";

export class UserResponse extends BaseEntityDto {
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
