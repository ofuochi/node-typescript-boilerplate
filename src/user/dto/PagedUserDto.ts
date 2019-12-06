import { PagedResultDto } from "../../shared/dto/base.dto";
import { UserDto } from "./UserResponse";
import { ApiProperty } from "@nestjs/swagger";

export class PagedUserDto extends PagedResultDto<UserDto> {
	@ApiProperty({
		required: false,
		type: UserDto
	})
	items: UserDto[];
}
