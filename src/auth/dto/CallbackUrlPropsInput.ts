import { IsEmail, IsNotEmpty, IsUrl, MaxLength } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

import { MAX_NAME_LENGTH } from "../../user/constants";

export class CallbackUrlPropsInput {
	@ApiProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsEmail()
	email: string;
	@ApiProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsUrl()
	clientBaseUrl: string;
	@ApiProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	verificationCodeParameterName: string;
	@ApiProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	emailParameterName: string;
}
