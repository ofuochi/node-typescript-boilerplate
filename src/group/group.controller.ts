import { Controller, Post, UseGuards, Body } from "@nestjs/common";
import { CreateGroupInput } from "./dto/CreateGroupInput";
import { GroupService } from "./group.service";
import { ApiCreatedResponse, ApiBearerAuth, ApiUseTags } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { plainToClass } from "class-transformer";
import { GroupDto } from "./dto/GroupDto";

@Controller("groups")
@ApiUseTags("Groups")
export class GroupController {
	constructor(private readonly _roleService: GroupService) {}

	@Post()
	@ApiCreatedResponse({
		type: GroupDto
	})
	@UseGuards(AuthGuard("jwt"))
	@ApiBearerAuth()
	async createGroup(@Body() input: CreateGroupInput): Promise<GroupDto> {
		const role = await this._roleService.create(input);

		return plainToClass(GroupDto, role, {
			enableImplicitConversion: true,
			excludeExtraneousValues: true
		});
	}
}
