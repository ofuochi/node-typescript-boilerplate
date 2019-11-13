import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { TenantRepository } from "./repository/tenant.repository";
import { TenantController } from "./tenant.controller";
import { Tenant } from "./tenant.entity";
import { TenantService } from "./tenant.service";

@Module({
	imports: [TypegooseModule.forFeature([Tenant])],
	exports: [TenantService, TenantRepository],
	providers: [TenantService, TenantRepository],
	controllers: [TenantController]
})
export class TenantModule {}
