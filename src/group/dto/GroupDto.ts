import {
	IsBoolean,
	IsInt,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
	MinDate
} from "class-validator";

import { ApiModelProperty } from "@nestjs/swagger";

import { schemaConsts } from "../../shared/constants/entity.constant";
import { BaseEntityDto } from "../../shared/dto/base.dto";
import { MAX_GRP_SIZE, MIN_GRP_SIZE } from "../group.entity";
import { Expose } from "class-transformer";

export class GroupDto extends BaseEntityDto {
	@ApiModelProperty({
		minimum: MIN_GRP_SIZE,
		maximum: MAX_GRP_SIZE,
		required: false
	})
	@Max(MAX_GRP_SIZE)
	@Min(MIN_GRP_SIZE)
	@IsInt()
	@IsOptional()
	@Expose()
	size: number;

	@ApiModelProperty({
		maxLength: schemaConsts.MAX_DESC_LENGTH,
		required: false
	})
	@MaxLength(schemaConsts.MAX_DESC_LENGTH)
	@IsOptional()
	@IsString()
	@Expose()
	goal: string;

	@ApiModelProperty({
		type: String,
		format: "date-time",
		required: false
	})
	@IsOptional()
	@MinDate(new Date())
	@Expose()
	expiresAt: Date;

	@ApiModelProperty({
		type: Boolean,
		required: false
	})
	@IsOptional()
	@IsBoolean()
	@Expose()
	isPublic: boolean;
}
