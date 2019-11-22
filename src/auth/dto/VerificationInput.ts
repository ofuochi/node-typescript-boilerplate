import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, MaxLength } from "class-validator";
import { MAX_NAME_LENGTH } from "../../user/user.entity";

export class VerificationInput {
	@ApiModelProperty({
		required: true
	})
	@IsNotEmpty()
	token: string;

	@ApiModelProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH
	})
	@IsEmail()
	email: string;
}
