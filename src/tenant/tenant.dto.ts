import { Expose } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from "class-validator";

import {
	BaseCreateEntityDto,
	BaseEntityDto,
	PagedResultDto
} from "../shared/dto/base.dto";
import { MAX_NAME_LENGTH } from "../user/user.entity";
import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTenantInput extends BaseCreateEntityDto {
	@ApiProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH,
		description: "The tenant name"
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	name: string;
	@ApiProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH,
		description: "Brief description about this tenant"
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	description: string;
}

export class TenantDto extends BaseEntityDto {
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@IsString()
	@Expose()
	@Optional()
	@ApiProperty({
		required: false,
		type: String,
		maxLength: MAX_NAME_LENGTH
	})
	name?: string;
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@Expose()
	@Optional()
	@ApiProperty({
		required: false,
		type: String,
		maxLength: MAX_NAME_LENGTH
	})
	description?: string;
	@IsBoolean()
	@Expose()
	@Optional()
	@ApiProperty({ required: false, type: Boolean })
	isActive?: boolean;
}
export class PagedTenantDto extends PagedResultDto<TenantDto> {
	@ApiProperty({
		required: false,
		type: TenantDto
	})
	items: TenantDto[];
}
