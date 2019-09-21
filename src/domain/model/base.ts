import { Typegoose, prop } from "@hasezoey/typegoose";

// This will allow you to change readonly properties
export type Writable<T> = {
    -readonly [K in keyof T]: T[K];
};
export default abstract class BaseEntity extends Typegoose {
    @prop({ required: true, default: new Date() })
    readonly createdAt: Date = new Date();
    @prop()
    readonly createdBy?: any;

    @prop()
    readonly updatedAt?: Date;
    @prop()
    readonly updatedBy?: any;

    @prop({ required: true, default: false })
    readonly isDeleted: boolean = false;

    @prop()
    readonly deletedBy?: any;
    @prop()
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
