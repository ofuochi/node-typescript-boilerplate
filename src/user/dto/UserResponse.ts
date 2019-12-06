import { Expose } from "class-transformer";
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
	IsBoolean
} from "class-validator";

import { MAX_NAME_LENGTH } from "../user.entity";
import { BaseEntityDto } from "../../shared/dto/base.dto";
import { ApiProperty } from "@nestjs/swagger";

export class UserDto extends BaseEntityDto {
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	@Expose()
	@ApiProperty()
	firstName: string;
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	@Expose()
	@ApiProperty()
	lastName: string;
	@MaxLength(MAX_NAME_LENGTH)
	@IsEmail()
	@IsOptional()
	@Expose()
	@ApiProperty()
	email: string;
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	@Expose()
	@ApiProperty()
	username: string;
	@IsBoolean()
	@IsOptional()
	@IsString()
	@Expose()
	@ApiProperty({ type: Boolean })
	isActive: boolean;
}
