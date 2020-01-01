import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import {
	ArrayMaxSize,
	ArrayNotEmpty,
	ArrayUnique,
	IsArray,
	IsBoolean,
	IsInt,
	IsOptional,
	IsString,
	Max,
	MaxLength,
	Min,
	MinDate
} from "class-validator";
import { MAX_NAME_LENGTH } from "../../user/user.entity";
import { schemaConst } from "../../shared/constants/entity.constant";
import { BaseEntityDto } from "../../shared/dto/base.dto";
import { DEFAULT_GRP_SIZE, MAX_GRP_SIZE, MIN_GRP_SIZE } from "../group.entity";

export class GroupDto extends BaseEntityDto {
	@ApiProperty({
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

	@ApiProperty({
		maxLength: schemaConst.MAX_DESC_LENGTH,
		required: false
	})
	@MaxLength(schemaConst.MAX_DESC_LENGTH)
	@IsOptional()
	@IsString()
	@Expose()
	goal: string;

	@ApiProperty({
		type: String,
		format: "date-time",
		required: false
	})
	@IsOptional()
	@MinDate(new Date())
	@Expose()
	expiresAt: Date;

	@ApiProperty({
		type: Boolean,
		required: false
	})
	@IsOptional()
	@IsBoolean()
	@Expose()
	isPublic: boolean;
}
export class MembersInput {
	@ApiProperty({
		maxLength: MAX_NAME_LENGTH,
		type: Array
	})
	@IsArray()
	@ArrayUnique()
	@ArrayNotEmpty()
	//@ValidateNested({ each: true })
	@ArrayMaxSize(DEFAULT_GRP_SIZE)
	emails: string[];
}
