import { Document, Model } from "mongoose";

import User from "../../core/entities/User";

declare global {
    export interface Request {
        currentUser: User & Document;
    }
    export type UserDbModel = Model<User & Document>;
    export type UserDbContext = User & Document;
}
