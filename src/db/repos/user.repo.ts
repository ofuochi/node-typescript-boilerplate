import "reflect-metadata";
import { injectable } from "inversify";
import IUserRepo from "../../core/services/interfaces/repo/IUserRepo";
import User from "../../core/entities/User";
import { BaseRepo } from "./base.repo";
import { UserDto } from "../../models/DTO/user.dto";

@injectable()
export default class UserRepo extends BaseRepo<UserRepo,User>{
constructor() {
    super()
}
}
