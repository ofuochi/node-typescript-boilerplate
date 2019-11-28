import { ApiModelProperty } from '@nestjs/swagger';

import { PagedResultDto } from '../../shared/dto/base.dto';
import { UserDto } from './UserResponse';

export class PagedUserDto extends PagedResultDto<UserDto> {
	@ApiModelProperty({
		required: false,
		type: UserDto
	})
	items: UserDto[];
}