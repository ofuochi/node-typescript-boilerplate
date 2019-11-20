import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { ApiModelProperty } from '@nestjs/swagger';

import { BaseCreateEntityDto, BaseEntityDto } from '../base.dto';
import { MAX_NAME_LENGTH } from '../user/user.entity';

export class CreateTenantInput extends BaseCreateEntityDto {
  @ApiModelProperty({
    required: true,
    maxLength: MAX_NAME_LENGTH,
    description: "The tenant name",
  })
  @MaxLength(MAX_NAME_LENGTH)
  @IsNotEmpty()
  name: string;
  @ApiModelProperty({
    required: true,
    maxLength: MAX_NAME_LENGTH,
    description: "Brief description about this tenant",
  })
  @MaxLength(MAX_NAME_LENGTH)
  @IsNotEmpty()
  description: string;
}
export class TenantUpdateInput {
  @MaxLength(MAX_NAME_LENGTH)
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  name?: string;
  @MaxLength(MAX_NAME_LENGTH)
  @IsOptional()
  @IsNotEmpty()
  description?: string;
}
export class TenantDto extends BaseEntityDto {
  @MaxLength(MAX_NAME_LENGTH)
  @IsNotEmpty()
  @IsString()
  @Expose()
  @ApiModelProperty()
  name: string;
  @MaxLength(MAX_NAME_LENGTH)
  @IsNotEmpty()
  @Expose()
  @ApiModelProperty()
  description: string;
  @IsBoolean()
  @Expose()
  @ApiModelProperty()
  isActive: boolean;
}
