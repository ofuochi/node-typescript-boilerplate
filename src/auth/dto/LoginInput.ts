import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

import { MAX_NAME_LENGTH } from "../../user/constants";

export class LoginInput {
	@ApiProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	emailOrUsername: string;
	@ApiProperty({
		required: true,
		minLength: 6,
		maxLength: MAX_NAME_LENGTH
	})
	@MaxLength(MAX_NAME_LENGTH)
	@MinLength(6)
	@IsNotEmpty()
	password: string;
}
