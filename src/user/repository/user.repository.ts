import { ReturnModelType } from "@typegoose/typegoose";
import { Document } from "mongoose";
import { InjectModel } from "nestjs-typegoose";
import { BaseRepository } from "../../db/repos/base.repo";
import { User } from "../user.entity";
import { IUserRepository } from "./interfaces";

export type UserModel = User & Document;

export class UserRepository extends BaseRepository<User, UserModel>
	implements IUserRepository {
	constructor(
		@InjectModel(User)
		private readonly _userModel: ReturnModelType<typeof User>
	) {
		super(_userModel, () => new User());
	}
}
