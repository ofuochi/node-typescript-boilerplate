import {
    IsNotEmpty,
    MaxLength,
    IsString,
    IsBoolean,
    IsOptional
} from "class-validator";
import { Expose } from "class-transformer";

import { MAX_NAME_LENGTH } from "../../domain/model/user";
import { BaseCreateEntityDto, BaseEntityDto } from "./base_dto";

export class CreateTenantInput extends BaseCreateEntityDto {
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    @IsString()
    name: string;
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
    name: string;
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    @Expose()
    description: string;
    @IsBoolean()
    @Expose()
    isActive: boolean;
}
