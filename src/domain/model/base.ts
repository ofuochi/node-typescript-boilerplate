import { Typegoose, prop } from "typegoose";
export default abstract class BaseEntity extends Typegoose {
    @prop({ required: true })
    createdAt!: Date;
    @prop({ required: true })
    createdBy!: string;

    @prop()
    updatedAt?: Date;
    @prop()
    updatedBy?: Date;

    @prop({ required: true })
    isDeleted!: boolean;

    @prop()
    deletedBy?: string;
    @prop()
    deletionTime?: Date;
}
