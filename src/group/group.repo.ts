import { Document } from "mongoose";
import { InjectModel } from "nestjs-typegoose";

import { ReturnModelType } from "@typegoose/typegoose";

import { IBaseRepository } from "../db/interfaces/repo.interface";
import { BaseRepository } from "../db/repos/base.repo";
import { Group } from "./group.entity";

export type IGroupRepository = IBaseRepository<Group>;
export type GroupModel = Group & Document;

export class GroupRepository extends BaseRepository<Group, GroupModel>
	implements IGroupRepository {
	public constructor(
		@InjectModel(Group)
		private readonly groupModel: ReturnModelType<typeof Group>
	) {
		super(groupModel, () => new Group());
	}
}
