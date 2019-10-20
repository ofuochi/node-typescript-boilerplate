import { IsUUID } from "class-validator";
import { Expose } from "class-transformer";

export abstract class BaseCreateEntityDto {}

export abstract class BaseEntityDto {
    @IsUUID()
    @Expose()
    id!: string;
}
export abstract class BaseUpdateDto extends BaseEntityDto {}
