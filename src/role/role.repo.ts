import { IBaseRepository } from "./../db/interfaces/repo.interface";
import { Document } from "mongoose";
import { InjectModel } from "nestjs-typegoose";

import { ReturnModelType } from "@typegoose/typegoose";
import { Role } from "./role.entity";
import { BaseRepository } from "../db/repos/base.repo";

export type IRoleRepository = IBaseRepository<Role>;
export type RoleModel = Role & Document;

export class RoleRepository extends BaseRepository<Role, RoleModel>
	implements IRoleRepository {
	public constructor(
		@InjectModel(Role)
		private readonly roleModel: ReturnModelType<typeof Role>
	) {
		super(roleModel, () => new Role());
	}
}
