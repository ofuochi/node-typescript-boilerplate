import { ApiModelProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";
import { MAX_NAME_LENGTH } from "../../user/constants";
export class RegisterInput {
  @ApiModelProperty({
    required: true,
    maxLength: MAX_NAME_LENGTH,
  })
  @MaxLength(MAX_NAME_LENGTH)
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @ApiModelProperty({
    required: true,
    maxLength: MAX_NAME_LENGTH,
  })
  @MaxLength(MAX_NAME_LENGTH)
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @ApiModelProperty({
    required: true,
    maxLength: MAX_NAME_LENGTH,
  })
  @IsEmail()
  email: string;
  @ApiModelProperty({
    required: true,
    maxLength: MAX_NAME_LENGTH,
  })
  @MaxLength(MAX_NAME_LENGTH)
  @IsNotEmpty()
  @IsString()
  username: string;
  @ApiModelProperty({
    required: true,
    maxLength: MAX_NAME_LENGTH,
  })
  @MaxLength(MAX_NAME_LENGTH)
  @IsNotEmpty()
  password: string;
}
