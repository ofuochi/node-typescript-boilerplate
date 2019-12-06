import { plainToClass } from "class-transformer";

import {
	Body,
	Controller,
	Post,
	Req,
	UseGuards,
	BadRequestException
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";

import { CreateGroupInput } from "./dto/CreateGroupInput";
import { GroupDto } from "./dto/GroupDto";
import { GroupService } from "./group.service";
import { UserRole } from "../user/user.entity";

@Controller("groups")
@ApiTags("Groups")
export class GroupController {
	constructor(private readonly _roleService: GroupService) {}

	@Post()
	@ApiCreatedResponse({
		type: GroupDto
	})
	@UseGuards(AuthGuard("jwt"))
	@ApiBearerAuth()
	async createGroup(
		@Body() input: CreateGroupInput,
		@Req() req: any
	): Promise<GroupDto> {
		const roles = req.user.roles as UserRole[];
		const isAdmin =
			roles.includes(UserRole.ADMIN) || roles.includes(UserRole.HOST);
		if (!isAdmin && input.isPublic)
			throw new BadRequestException("You can only create private groups");

		const role = await this._roleService.create(input);

		return plainToClass(GroupDto, role, {
			enableImplicitConversion: true,
			excludeExtraneousValues: true
		});
	}
}
