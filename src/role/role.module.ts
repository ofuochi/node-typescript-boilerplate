import { Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleController } from "./role.controller";
import { TypegooseModule } from "nestjs-typegoose";
import { Role } from "./role.entity";
import { RoleRepository } from "./role.repo";

@Module({
	imports: [TypegooseModule.forFeature([Role])],
	exports: [RoleService, RoleRepository],
	providers: [RoleService, RoleRepository],
	controllers: [RoleController]
})
export class RoleModule {}
