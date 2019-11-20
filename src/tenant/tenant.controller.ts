import { plainToClass } from 'class-transformer';

import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiUseTags } from '@nestjs/swagger';

import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../user/user.entity';
import { CreateTenantInput, TenantDto } from './tenant.dto';
import { TenantService } from './tenant.service';

@ApiUseTags("Tenants")
@Controller("tenant")
export class TenantController {
  constructor(private readonly _tenantService: TenantService) {}

  @ApiOperation({
    description:
      "Create a new tenant. This operation can only be done by the admin.",
    operationId: "CreateTenant",
    title: "Creates Tenant",
  })
  @ApiCreatedResponse({
    type: TenantDto,
  })
  @Post()
  @UseGuards(AuthGuard("jwt"))
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  async createTenant(
    @Body() input: CreateTenantInput,
    @Request() req: any,
  ): Promise<TenantDto> {
    const result = await this._tenantService.create(
      input.name,
      input.description,
    );
    return plainToClass(TenantDto, result, {
      enableImplicitConversion: true,
      excludeExtraneousValues: true,
    });
  }
  @Get(":tenantName")
  async getTenant(@Param("tenantName") tenantName: string) {
    return tenantName;
  }
}
