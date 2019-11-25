import {
	MaxLength,
	IsNotEmpty,
	IsOptional,
	IsString,
	Max,
	Min,
	IsNumber
} from "class-validator";

import { MAX_NAME_LENGTH } from "../../user/user.entity";
import { ApiModelProperty } from "@nestjs/swagger";

export class GetAllInput {
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	@ApiModelProperty({
		required: false,
		maxLength: MAX_NAME_LENGTH
	})
	search?: string;
	@Min(1)
	@Max(100)
	@IsNumber()
	@IsOptional()
	@ApiModelProperty({
		required: false,
		maximum: 100,
		minimum: 1,
		default: 1
	})
	limit?: number = 0;
	@ApiModelProperty({
		required: false,
		minimum: 0,
		default: 0
	})
	@Min(0)
	@IsNumber()
	@IsOptional()
	skip?: number = 0;
}
