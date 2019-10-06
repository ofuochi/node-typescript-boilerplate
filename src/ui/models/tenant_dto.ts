import { IsNotEmpty, MaxLength, IsString, IsBoolean } from "class-validator";
import { Expose } from "class-transformer";

import { MAX_NAME_LENGTH } from "../../domain/model/user";
import { BaseInputDto, BaseResponseDto } from "./base_dto";

export class CreateTenantInput extends BaseInputDto {
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    @IsString()
    name: string;
    @MaxLength(MAX_NAME_LENGTH)
    @IsNotEmpty()
    description: string;
}
export class TenantDto extends BaseResponseDto {
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
