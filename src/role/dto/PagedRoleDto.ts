import { ApiModelProperty } from "@nestjs/swagger";

import { PagedResultDto } from "../../shared/dto/base.dto";
import { RoleDto } from "./RoleDto";

export class PagedTenantDto extends PagedResultDto<RoleDto> {
	@ApiModelProperty({
		required: false,
		type: RoleDto
	})
	items: RoleDto[];
}
