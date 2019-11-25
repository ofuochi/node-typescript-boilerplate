import { Expose } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from "class-validator";

import { ApiModelProperty } from "@nestjs/swagger";

import {
	BaseCreateEntityDto,
	BaseEntityDto,
	PagedResultDto
} from "../shared/dto/base.dto";
import { MAX_NAME_LENGTH } from "../user/user.entity";
import { Optional } from "@nestjs/common";

export class CreateTenantInput extends BaseCreateEntityDto {
	@ApiModelProperty({
		required: true,
		maxLength: MAX_NAME_LENGTH,
		description: "The tenant name"
	})
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	name: string;
	@ApiModelProperty({
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
	@ApiModelProperty({
		required: false,
		type: String,
		maxLength: MAX_NAME_LENGTH
	})
	name?: string;
	@MaxLength(MAX_NAME_LENGTH)
	@IsNotEmpty()
	@Expose()
	@Optional()
	@ApiModelProperty({
		required: false,
		type: String,
		maxLength: MAX_NAME_LENGTH
	})
	description?: string;
	@IsBoolean()
	@Expose()
	@Optional()
	@ApiModelProperty({ required: false, type: Boolean })
	isActive?: boolean;
}
export class PagedTenantDto extends PagedResultDto<TenantDto> {
	@ApiModelProperty({
		required: false,
		type: TenantDto
	})
	items: TenantDto[];
}
