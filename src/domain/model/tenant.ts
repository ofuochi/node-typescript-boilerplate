import BaseEntity from "./base";
import { prop } from "typegoose";

export default class Tenant extends BaseEntity {
    @prop({ required: true })
    name!: string;
    @prop({ required: true })
    description!: string;
}
