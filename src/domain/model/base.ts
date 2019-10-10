import { instanceMethod, pre, prop, Ref, Typegoose } from "@hasezoey/typegoose";
import { Expose } from "class-transformer";
import { Query } from "mongoose";

import { Writable } from "../utils/writable";
import { User } from "./user";

// eslint-disable-next-line
@pre<BaseEntity>("findOneAndUpdate", function(this: Query<BaseEntity>, next) {
    try {
        const entity = this.getUpdate();
        const user = (global.currentUser && global.currentUser.user) as User;
        if (user) {
            entity.updatedBy = user.id;
            if (entity.isDeleted) {
                entity.deletedBy = user.id;
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
        const user = global.currentUser && global.currentUser.user;
        const creator = user || this.type === "User" ? this : undefined;
        if (creator) this.setCreatedBy(creator);
        next();
    } catch (error) {
        next(error);
    }
})
export abstract class BaseEntity extends Typegoose {
    abstract type: string;
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
    private setCreatedBy(user: BaseEntity) {
        (this as Writable<BaseEntity>).createdBy = user.id;
    }
}
