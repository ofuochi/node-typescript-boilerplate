import { plainToClass } from "class-transformer";

import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Query,
	Request,
	UseGuards,
	Delete
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUseTags
} from "@nestjs/swagger";

import { Roles } from "../decorators/roles.decorator";
import { PagedResultDto } from "../shared/dto/base.dto";
import { GetAllInput } from "../shared/dto/GetAll";
import { UserRole } from "../user/user.entity";
import { CreateTenantInput, PagedTenantDto, TenantDto } from "./tenant.dto";
import { TenantService } from "./tenant.service";
import { RolesGuard } from "../auth/guards/roles.guard";

@ApiUseTags("Tenants")
@Controller("tenants")
export class TenantController {
	constructor(private readonly _tenantService: TenantService) {}

	@Post()
	@ApiOperation({
		description:
			"Create a new tenant. This operation can only be done by the admin.",
		operationId: "CreateTenant",
		title: "Creates Tenant"
	})
	@ApiCreatedResponse({
		type: TenantDto
	})
	@Roles(UserRole.HOST)
	@UseGuards(AuthGuard("jwt"), RolesGuard)
	@ApiBearerAuth()
	async createTenant(
		@Body() input: CreateTenantInput,
		@Request() req: any
	): Promise<TenantDto> {
		const tenant = await this._tenantService.create(
			input.name,
			input.description
		);
		return plainToClass(TenantDto, tenant, {
			enableImplicitConversion: true,
			excludeExtraneousValues: true
		});
	}

	@Get()
	@Roles(UserRole.HOST)
	@UseGuards(AuthGuard("jwt"), RolesGuard)
	@ApiOkResponse({
		type: PagedTenantDto
	})
	@ApiBearerAuth()
	async getTenants(
		@Query() input: GetAllInput
	): Promise<PagedResultDto<TenantDto>> {
		const { totalCount, items } = await this._tenantService.pagedGetAll(input);
		const results = plainToClass(TenantDto, items, {
			enableImplicitConversion: true,
			excludeExtraneousValues: true
		});
		return {
			totalCount,
			items: results
		};
	}

	@ApiCreatedResponse({
		type: TenantDto
	})
	@Get(":tenantName")
	async getTenant(@Param("tenantName") tenantName: string): Promise<TenantDto> {
		const tenant = await this._tenantService.getTenantByName(tenantName);

		return plainToClass(TenantDto, tenant, {
			enableImplicitConversion: true,
			excludeExtraneousValues: true
		});
	}

	@Put()
	@Roles(UserRole.HOST)
	@UseGuards(AuthGuard("jwt"), RolesGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiBearerAuth()
	async updateTenant(@Body() input: TenantDto) {
		await this._tenantService.update(input);
	}
	@Delete(":id")
	@Roles(UserRole.HOST)
	@UseGuards(AuthGuard("jwt"), RolesGuard)
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiBearerAuth()
	async deleteTenant(@Param("id") id: string) {
		await this._tenantService.deleteById(id);
	}
}
