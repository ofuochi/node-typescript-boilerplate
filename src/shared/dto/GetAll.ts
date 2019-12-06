import {
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min
} from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

import { MAX_NAME_LENGTH } from "../../user/user.entity";

export class GetAllInput {
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@IsOptional()
	@IsString()
	@ApiProperty({
		required: false,
		maxLength: MAX_NAME_LENGTH
	})
	search?: string;
	@Min(1)
	@Max(100)
	@IsNumber()
	@IsOptional()
	@ApiProperty({
		required: false,
		maximum: 100,
		minimum: 1,
		default: 1
	})
	limit?: number = 0;
	@ApiProperty({
		required: false,
		minimum: 0,
		default: 0
	})
	@Min(0)
	@IsNumber()
	@IsOptional()
	skip?: number = 0;
}
