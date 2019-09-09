import { Document, Model } from "mongoose";
import UserEntity from "../../models/entities/UserEntity";

declare global {
  namespace Express {
    export interface Request {
      currentUser: UserEntity & Document;
    }
  }
  namespace Models {
    export type UserDbModel = Model<UserEntity & Document>;
    export type UserDbContext = UserEntity & Document;
  }
}
