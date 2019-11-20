import { IsUUID } from 'class-validator';

import { ApiModelProperty } from '@nestjs/swagger';

export abstract class BaseCreateEntityDto {}

export abstract class BaseEntityDto {
  @IsUUID()
  @ApiModelProperty({ required: true })
  id!: string;
}
export abstract class PagedResultDto<T> {
  totalCount: number;
  items: T[];
}
export abstract class BaseUpdateDto extends BaseEntityDto {}
