import { IsUUID } from "class-validator";
import { Expose } from "class-transformer";

export abstract class BaseCreateDto {}

export abstract class BaseReadDto {
    @IsUUID()
    @Expose()
    id: string;
}
export abstract class BaseUpdateDto extends BaseReadDto {}
