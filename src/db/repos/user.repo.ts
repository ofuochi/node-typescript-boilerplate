import "reflect-metadata";
import { injectable, inject } from "inversify";
import { Model, Document } from "mongoose";

import { TYPES } from "../../config/dependencyInjection/typeMapping";
import UserEntity from "../../models/entities/UserEntity";

@injectable()
export default class UserRepo {
    private readonly _userDbModel: UserDbModel;

    constructor(@inject(TYPES.UserDbContext) userDbCtx: UserDbModel) {
        this._userDbModel = userDbCtx;
    }

    save = async (entity: UserEntity): Promise<UserDbContext> => {
        const user = await this._userDbModel.findOne({
            _id: entity.email,
            tenant: entity.tenantId
        });
        return this._userDbModel.create(user);
    };
}
