import { IsUUID } from "class-validator";

export abstract class BaseInputDto {}
export abstract class BaseResponseDto {
    @IsUUID()
    id: string;
}
