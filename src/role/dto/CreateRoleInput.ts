import { IsNotEmpty, MaxLength } from "class-validator";

import { ApiModelProperty } from "@nestjs/swagger";

import { BaseCreateEntityDto } from "../../shared/dto/base.dto";
import { MAX_NAME_LENGTH } from "../../user/user.entity";

export class CreateRoleInput extends BaseCreateEntityDto {
	@ApiModelProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH,
		description: "Non-space role name"
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	name: string;
	@ApiModelProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH,
		description: "Brief description about this role"
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	description: string;
}
