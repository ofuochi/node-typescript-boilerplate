import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

import { MAX_NAME_LENGTH } from "../../user/constants";

export class RegisterInput {
	@ApiProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@IsString()
	firstName: string;
	@ApiProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@IsString()
	lastName: string;
	@ApiProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH
	})
	@IsEmail()
	email: string;
	@ApiProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@IsString()
	username: string;
	@ApiProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	password: string;
}
