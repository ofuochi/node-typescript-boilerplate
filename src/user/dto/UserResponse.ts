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
import { ApiModelProperty } from "@nestjs/swagger";

export class UserDto extends BaseEntityDto {
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	@Expose()
	@ApiModelProperty()
	firstName: string;
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	@Expose()
	@ApiModelProperty()
	lastName: string;
	@MaxLength(MAX_NAME_LENGTH)
	@IsEmail()
	@IsOptional()
	@Expose()
	@ApiModelProperty()
	email: string;
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	@Expose()
	@ApiModelProperty()
	username: string;
	@IsBoolean()
	@IsOptional()
	@IsString()
	@Expose()
	@ApiModelProperty({ type: Boolean })
	isActive: boolean;
}
