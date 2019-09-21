import { injectable } from "inversify";
import { Document } from "mongoose";

import { dbClient } from "../../../domain/constants/decorators";
import { IUserRepository } from "../../../domain/interfaces/repositories";
import { User } from "../../../domain/model/user";
import { DbClient } from "../db_client";
import { BaseRepository } from "./base_repository";

export interface UserModel extends User, Document {}

@injectable()
export class UserRepository extends BaseRepository<User, UserModel>
    implements IUserRepository {
    public constructor(@dbClient dbClient: DbClient) {
        super(dbClient, "Users", {
            username: String,
            email: String,
            password: String,
            roles: [String]
        });
    }
}
