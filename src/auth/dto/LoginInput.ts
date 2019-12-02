import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

import { ApiModelProperty } from "@nestjs/swagger";

import { MAX_NAME_LENGTH } from "../../user/constants";

export class LoginInput {
	@ApiModelProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	emailOrUsername: string;
	@ApiModelProperty({
		required: true,
		minLength: 6,
		maxLength: MAX_NAME_LENGTH
	})
	@MaxLength(MAX_NAME_LENGTH)
	@MinLength(6)
	@IsNotEmpty()
	password: string;
}
