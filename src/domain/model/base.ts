import { instanceMethod, pre, prop, Ref, Typegoose } from "@hasezoey/typegoose";
import { Expose } from "class-transformer";
import { Query } from "mongoose";

import { Writable } from "../utils/writable";
import { User } from "./user";

// eslint-disable-next-line
@pre<User>("findOneAndUpdate", function(this: Query<User>, next) {
    try {
        const entity = this.getUpdate();
        const currentUser = global.currentUser.user;
        const user = (currentUser && currentUser.id) || entity.id;
        entity.updatedBy = user;
        if (entity.isDeleted) entity.deletedBy = user;
        next();
    } catch (error) {
        next(error);
    }
})
// eslint-disable-next-line
@pre<User>("save", function(next) {
    try {
        const createdBy =
            (global.currentUser && global.currentUser.user) || this;
        this.setCreatedBy(createdBy);
        next();
    } catch (error) {
        next(error);
    }
})
export abstract class BaseEntity extends Typegoose {
    @Expose()
    id?: any;

    @prop({ required: true, default: new Date() })
    @Expose()
    readonly createdAt: Date = new Date();
    @prop({ default: null, ref: BaseEntity })
    @Expose()
    readonly createdBy?: Ref<User>;
    @prop({ default: null })
    @Expose()
    readonly updatedAt?: Date;
    @prop({ default: null, ref: BaseEntity })
    @Expose()
    readonly updatedBy?: Ref<User>;
    @prop({ required: true, default: true })
    @Expose()
    readonly isActive: boolean = true;
    @prop({ required: true, default: false })
    @Expose()
    readonly isDeleted: boolean = false;
    @prop({ default: null, ref: BaseEntity })
    @Expose()
    readonly deletedBy?: Ref<User>;
    @prop({ default: null })
    @Expose()
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
    private setDeletedBy(user: BaseEntity): void {
        (this as Writable<BaseEntity>).deletedBy = user as User;
    }
    @instanceMethod
    private setCreatedBy(user: BaseEntity) {
        (this as Writable<BaseEntity>).createdBy = user as User;
    }
}
