import { prop, Typegoose, Ref } from "@hasezoey/typegoose";

import { Writable } from "../utils/writable";

abstract class BaseEntity<T> extends Typegoose {
    id?: any;

    @prop({ required: true, default: new Date() })
    readonly createdAt: Date = new Date();
    @prop({ default: null })
    readonly createdBy?: Ref<T>;
    @prop({ default: null })
    readonly updatedAt?: Date;
    @prop({ default: null })
    readonly updatedBy?: any = null;
    @prop({ required: true, default: true })
    readonly isActive: boolean = true;
    @prop({ required: true, default: false })
    readonly isDeleted: boolean = false;
    @prop({ default: null })
    readonly deletedBy?: any = null;
    @prop({ default: null })
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
