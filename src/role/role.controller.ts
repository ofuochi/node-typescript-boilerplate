import { plainToClass } from "class-transformer";

import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";

import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../user/user.entity";
import { CreateRoleInput } from "./dto/CreateRoleInput";
import { RoleDto } from "./dto/RoleDto";
import { RoleService } from "./role.service";

@Controller("roles")
@ApiTags("Roles")
export class RoleController {
	constructor(private readonly _roleService: RoleService) {}

	@Post()
	@ApiCreatedResponse({
		type: RoleDto
	})
	@Roles(UserRole.HOST, UserRole.ADMIN)
	@UseGuards(AuthGuard("jwt"), RolesGuard)
	@ApiBearerAuth()
	async createRole(@Body() input: CreateRoleInput): Promise<RoleDto> {
		const role = await this._roleService.create(input.name, input.description);

		return plainToClass(RoleDto, role, {
			enableImplicitConversion: true,
			excludeExtraneousValues: true
		});
	}
}
