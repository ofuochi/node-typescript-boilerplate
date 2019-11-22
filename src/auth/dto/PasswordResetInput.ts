import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength } from "class-validator";
import { MAX_NAME_LENGTH } from "../../user/user.entity";
import { VerificationInput } from "./VerificationInput";

export class PasswordResetInput extends VerificationInput {
	@ApiModelProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	newPassword: string;
}
