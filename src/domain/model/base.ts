import { prop, Typegoose, Ref, instanceMethod } from "@hasezoey/typegoose";
import { Expose } from "class-transformer";
import { Writable } from "../utils/writable";
import { User } from "./user";


abstract class BaseEntity extends Typegoose {

    @Expose()
    id?: any;

    @prop({ required: true, default: new Date() })
    @Expose()
    readonly createdAt: Date = new Date();
    @prop({ default: null })
    @Expose()
    readonly createdBy?: Ref<User>;
    @prop({ default: null })
    @Expose()
    readonly updatedAt?: Date;
    @prop({ default: null })
    @Expose()
    readonly updatedBy?: any = null;
    @prop({ required: true, default: true })
    @Expose()
    readonly isActive: boolean = true;
    @prop({ required: true, default: false })
    @Expose()
    readonly isDeleted: boolean = false;
    @prop({ default: null })
    @Expose()
    readonly deletedBy?: any = null;
    @prop({ default: null })
    @Expose()
    readonly deletionTime?: Date;

    @instanceMethod
    delete(): void {
        (this as Writable<BaseEntity>).isDeleted = true;
    };

    @instanceMethod
    restore(): void {
        (this as Writable<BaseEntity>).isDeleted = false;
    };

    @instanceMethod
    deactivate(): void {
        (this as Writable<BaseEntity>).isActive = false;
    };

    @instanceMethod
    activate(): void {
        (this as Writable<BaseEntity>).isActive = true;
    };
}
export default BaseEntity;
