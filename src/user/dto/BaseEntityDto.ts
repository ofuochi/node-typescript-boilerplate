import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export abstract class BaseEntityDto {
  @IsUUID()
  @Expose()
  id!: string;
}
