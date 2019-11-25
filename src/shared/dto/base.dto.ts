import { Expose } from "class-transformer";
import { IsMongoId } from "class-validator";

import { ApiModelProperty } from "@nestjs/swagger";

export abstract class BaseCreateEntityDto {}

export abstract class BaseEntityDto {
	@Expose()
	@IsMongoId()
	@ApiModelProperty()
	id: string;
}
export abstract class PagedResultDto<T> {
	@ApiModelProperty({ required: false })
	totalCount: number;
	@ApiModelProperty({
		isArray: true
	})
	abstract items: T[];
}
export abstract class BaseUpdateDto extends BaseEntityDto {}
