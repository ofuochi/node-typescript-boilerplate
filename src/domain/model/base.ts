import { prop, Typegoose } from "@hasezoey/typegoose";

import { Writable } from "../utils/writable";

export default abstract class BaseEntity extends Typegoose {
    id?: any;

    @prop({ required: true, default: new Date() })
    readonly createdAt: Date = new Date();
    @prop({ default: null })
    readonly createdBy?: any = null;
    @prop({ default: null })
    readonly updatedAt?: Date;
    @prop({ default: null })
    readonly updatedBy?: any = null;

    @prop({ required: true, default: false })
    readonly isDeleted: boolean = false;

    @prop({ default: null })
    readonly deletedBy?: any = null;
    @prop({ default: null })
    readonly deletionTime?: Date;

    @prop({ required: true, default: true })
    readonly isActive: boolean = true;

    delete = (): void => {
        (this as Writable<BaseEntity>).isDeleted = true;
    };
    deactivate = (): void => {
        (this as Writable<BaseEntity>).isActive = false;
    };
}
