import { Container } from "inversify";
import UserSchema from "../../db/schemas/user.schema";
import { TYPES } from "./typeMapping";
import UserRepo from "../../db/repos/user.repo";

const container = new Container();
container.bind<UserDbContext>(TYPES.UserDbModel).to(UserSchema);
container.bind<UserRepo>(TYPES.UserRepo).to(UserRepo);

export default container;
