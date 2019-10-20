import { instanceMethod, pre, prop, Ref, Typegoose } from "@hasezoey/typegoose";
import { Expose } from "class-transformer";
import { Query } from "mongoose";

import { Writable } from "../utils/writable";
import { User } from "./user";
import { iocContainer } from "../../infrastructure/config/ioc";
import { TYPES } from "../constants/types";
import { DecodedJwt } from "../../ui/services/auth_service";

// eslint-disable-next-line
@pre<BaseEntity>("findOneAndUpdate", function(this: Query<BaseEntity>, next) {
    try {
        const entity = this.getUpdate();
        if (iocContainer.isBound(TYPES.DecodedJwt)) {
            const currentUser = iocContainer.get<DecodedJwt>(TYPES.DecodedJwt);
            entity.updatedBy = currentUser.userId;
            if (entity.isDeleted) {
                entity.deletedBy = currentUser.userId;
                entity.deletionTime = new Date();
            }
        }

        next();
    } catch (error) {
        next(error);
    }
})
// eslint-disable-next-line
@pre<BaseEntity>("save", function(next) {
    try {
        if (iocContainer.isBound(TYPES.DecodedJwt)) {
            const currentUser = iocContainer.get<DecodedJwt>(TYPES.DecodedJwt);
            this.setCreatedBy(currentUser.userId);
        } else if (this.type === "User") {
            this.setCreatedBy(this);
        }
        next();
    } catch (error) {
        next(error);
    }
})
export abstract class BaseEntity extends Typegoose {
    abstract type: string;
    abstract update(entity: Partial<BaseEntity>): void;

    @Expose()
    id?: any;

    @Expose()
    @prop({ required: true, default: new Date() })
    readonly createdAt: Date = new Date();
    @Expose()
    @prop({ default: null, ref: BaseEntity })
    readonly createdBy: Ref<User | null> = null;
    @Expose()
    @prop({ default: null })
    readonly updatedAt?: Date;
    @Expose()
    @prop({ default: null, ref: BaseEntity })
    readonly updatedBy: Ref<User | null> = null;
    @Expose()
    @prop({ required: true, default: true })
    readonly isActive: boolean = true;
    @Expose()
    @prop({ required: true, default: false })
    readonly isDeleted: boolean = false;
    @Expose()
    @prop({ default: null, ref: BaseEntity })
    readonly deletedBy: Ref<User | null> = null;
    @Expose()
    @prop({ default: null })
    readonly deletionTime?: Date;

    @instanceMethod
    delete(): void {
        (this as Writable<BaseEntity>).isDeleted = true;
    }

    @instanceMethod
    restore(): void {
        (this as Writable<BaseEntity>).isDeleted = false;
    }

    @instanceMethod
    deactivate(): void {
        (this as Writable<BaseEntity>).isActive = false;
    }

    @instanceMethod
    activate(): void {
        (this as Writable<BaseEntity>).isActive = true;
    }

    @instanceMethod
    private setCreatedBy(user: any) {
        (this as Writable<BaseEntity>).createdBy = user;
    }
}
