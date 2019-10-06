import { IsUUID } from "class-validator";
import { Expose } from "class-transformer";

export abstract class BaseInputDto {}
export abstract class BaseResponseDto {
    @IsUUID()
    @Expose()
    id: string;
}
