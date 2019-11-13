import { IsUUID } from "class-validator";
import { Expose } from "class-transformer";
export abstract class BaseEntityDto {
  @IsUUID()
  @Expose()
  id!: string;
}
