import { DEFAULT_GRP_SIZE } from "./../group.entity";
import {
	IsBoolean,
	IsInt,
	IsNotEmpty,
	IsString,
	Max,
	MaxLength,
	Min,
	MinDate,
	IsDate
} from "class-validator";
import { BaseCreateEntityDto } from "../../shared/dto/base.dto";

import { ApiModelProperty } from "@nestjs/swagger";

import { schemaConsts } from "../../shared/constants/entity.constant";
import { MAX_GRP_SIZE, MIN_GRP_SIZE } from "../group.entity";

export class CreateGroupInput extends BaseCreateEntityDto {
	@ApiModelProperty({
		maxLength: schemaConsts.MAX_DESC_LENGTH,
		description: "Non-space group name"
	})
	@MaxLength(schemaConsts.MAX_DESC_LENGTH)
	@IsNotEmpty()
	name: string;

	@ApiModelProperty({
		minimum: MIN_GRP_SIZE,
		maximum: MAX_GRP_SIZE,
		default: DEFAULT_GRP_SIZE,
		example: DEFAULT_GRP_SIZE
	})
	@Max(MAX_GRP_SIZE)
	@Min(MIN_GRP_SIZE)
	@IsInt()
	@IsNotEmpty()
	size: number;

	@ApiModelProperty({
		maxLength: schemaConsts.MAX_DESC_LENGTH
	})
	@MaxLength(schemaConsts.MAX_DESC_LENGTH)
	@IsNotEmpty()
	@IsString()
	goal: string;

	@ApiModelProperty({
		example: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
		default: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
		type: String,
		format: "date-time"
	})
	@IsDate()
	@MinDate(new Date())
	expiresAt: Date;

	@ApiModelProperty({
		type: Boolean
	})
	@IsBoolean()
	isPublic: boolean;
}
