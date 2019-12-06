import { Expose } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from "class-validator";

import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

import { BaseEntityDto } from "../../shared/dto/base.dto";
import { MAX_NAME_LENGTH } from "../../user/user.entity";

export class RoleDto extends BaseEntityDto {
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@IsString()
	@Expose()
	@Optional()
	@ApiProperty({
		required: false,
		type: String,
		maxLength: MAX_NAME_LENGTH
	})
	name?: string;
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@Expose()
	@Optional()
	@ApiProperty({
		required: false,
		type: String,
		maxLength: MAX_NAME_LENGTH
	})
	description?: string;
	@IsBoolean()
	@Expose()
	@Optional()
	@ApiProperty({ required: false, type: Boolean })
	isActive?: boolean;
}
