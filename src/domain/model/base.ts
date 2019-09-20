import { Typegoose, prop } from "typegoose";
export default abstract class BaseEntity extends Typegoose {
    @prop({ required: true })
    createdAt!: Date;
    @prop({ required: true })
    createdBy!: any;

    @prop()
    updatedAt?: Date;
    @prop()
    updatedBy?: any;

    @prop({ required: true })
    isDeleted!: boolean;

    @prop()
    deletedBy?: any;
    @prop()
    deletionTime?: Date;
}
