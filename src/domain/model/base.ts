import { prop, Typegoose, Ref } from "@hasezoey/typegoose";
import { Expose } from "class-transformer";

import { Writable } from "../utils/writable";

abstract class BaseEntity<T> extends Typegoose {
    @Expose()
    id?: any;

    @prop({ required: true, default: new Date() })
    @Expose()
    readonly createdAt: Date = new Date();
    @prop({ default: null })
    @Expose()
    readonly createdBy?: Ref<T>;
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

    delete = (): void => {
        (this as Writable<BaseEntity<T>>).isDeleted = true;
    };
    restore = (): void => {
        (this as Writable<BaseEntity<T>>).isDeleted = false;
    };
    deactivate = (): void => {
        (this as Writable<BaseEntity<T>>).isActive = false;
    };
    activate = (): void => {
        (this as Writable<BaseEntity<T>>).isActive = true;
    };
}
export default BaseEntity;
