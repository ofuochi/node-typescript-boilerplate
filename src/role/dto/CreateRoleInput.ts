import { IsNotEmpty, MaxLength } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

import { BaseCreateEntityDto } from "../../shared/dto/base.dto";
import { MAX_NAME_LENGTH } from "../../user/user.entity";

export class CreateRoleInput extends BaseCreateEntityDto {
	@ApiProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH,
		description: "Non-space role name"
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	name: string;
	@ApiProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH,
		description: "Brief description about this role"
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	description: string;
}
