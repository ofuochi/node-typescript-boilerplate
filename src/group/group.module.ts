import { TypegooseModule } from "nestjs-typegoose";

import { Module } from "@nestjs/common";

import { GroupController } from "./group.controller";
import { Group } from "./group.entity";
import { GroupRepository } from "./group.repo";
import { GroupService } from "./group.service";

@Module({
	imports: [TypegooseModule.forFeature([Group])],
	exports: [GroupService, GroupRepository],
	providers: [GroupService, GroupRepository],
	controllers: [GroupController]
})
export class GroupModule {}
