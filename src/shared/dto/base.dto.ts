import { Expose } from "class-transformer";
import { IsMongoId } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export abstract class BaseCreateEntityDto {}

export abstract class BaseEntityDto {
	@Expose()
	@IsMongoId()
	@ApiProperty()
	id: string;
}
export abstract class PagedResultDto<T> {
	@ApiProperty({ required: false })
	totalCount: number;
	@ApiProperty({
		isArray: true
	})
	abstract items: T[];
}
export abstract class BaseUpdateDto extends BaseEntityDto {}
