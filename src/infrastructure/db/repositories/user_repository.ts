import { injectable } from "inversify";
import { Document } from "mongoose";

import { IUserRepository } from "../../../domain/interfaces/repositories";
import { User } from "../../../domain/model/user";
import { BaseRepository } from "./base_repository";

export interface UserModel extends User, Document {}

@injectable()
export class UserRepository extends BaseRepository<User, UserModel>
    implements IUserRepository {
    public constructor() {
        super(User.model);
    }
}
