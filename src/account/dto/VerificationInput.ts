import {
	MaxLength,
	IsEmail,
	IsUrl,
	IsNotEmpty,
	IsString
} from "class-validator";

import { MAX_NAME_LENGTH } from "../../user/user.entity";

export class VerificationInput {
	@MaxLength(MAX_NAME_LENGTH)
	@IsEmail()
	email: string;
	@MaxLength(MAX_NAME_LENGTH)
	@IsUrl()
	clientBaseUrl: string;
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@IsString()
	verificationCodeParameterName: string;
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@IsString()
	emailParameterName: string;
}
