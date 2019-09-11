import IBaseRepo from "./IBaseRepo";
import User from "../../../entities/User";

export default interface IUserRepo extends IBaseRepo<User> {
    findUserByEmail(email: string): Promise<User>;
    findUserByUsername(username: string): Promise<User>;
}
