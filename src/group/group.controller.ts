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
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiTags,
	ApiNoContentResponse
} from "@nestjs/swagger";

import { CreateGroupInput } from "./dto/CreateGroupInput";
import { GroupDto, MembersInput } from "./dto/GroupDto";
import { GroupService } from "./group.service";
import { UserRole } from "../user/user.entity";

@Controller("groups")
@ApiTags("Groups")
//@UseGuards(AuthGuard("jwt"))
export class GroupController {
	constructor(private readonly _roleService: GroupService) {}

	@Post()
	@ApiCreatedResponse({
		type: GroupDto
	})
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
	@Post("invite_members")
	@ApiNoContentResponse()
	@ApiBearerAuth()
	async inviteMembers(@Body() input: MembersInput) {}
}
