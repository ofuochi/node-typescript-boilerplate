import { TypegooseModule } from "nestjs-typegoose";

import { Module } from "@nestjs/common";

import { GroupController } from "./group.controller";
import { Group } from "./group.entity";
import { GroupRepository } from "./group.repo";
import { GroupService } from "./group.service";
import { TravelPackageModule } from "../travel-package/travel-package.module";

@Module({
	imports: [TypegooseModule.forFeature([Group]), TravelPackageModule],
	exports: [GroupService, GroupRepository],
	providers: [GroupService, GroupRepository],
	controllers: [GroupController]
})
export class GroupModule {}
