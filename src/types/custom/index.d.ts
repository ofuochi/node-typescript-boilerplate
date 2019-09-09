import { Document, Model } from "mongoose";

import UserEntity from "../../models/entities/UserEntity";

declare global {
    export interface Request {
        currentUser: UserEntity & Document;
    }
    export type UserDbModel = Model<UserEntity & Document>;
    export type UserDbContext = UserEntity & Document;
}
