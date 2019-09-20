import { injectable } from "inversify";
import { Document } from "mongoose";
import { DbClient } from "../db_client";
import { dbClient } from "../../../domain/constants/decorators";
import { BaseRepository } from "./base_repository";
import { User } from "../../../domain/model/user";
import { IUserRepository } from "../../../domain/interfaces/repositories";

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
