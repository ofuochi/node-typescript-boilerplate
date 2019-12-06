import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, MaxLength } from "class-validator";
import { MAX_NAME_LENGTH } from "../../user/user.entity";

export class VerificationInput {
	@ApiProperty({
		required: true
	})
	@IsNotEmpty()
	token: string;

	@ApiProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH
	})
	@IsEmail()
	email: string;
}
