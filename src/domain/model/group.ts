import BaseEntity from "./base";
import Tenant from "./tenant";
import { prop, Ref } from "typegoose";
import { IMustHaveTenant } from "./interfaces/entity";

export default class Group extends BaseEntity implements IMustHaveTenant {
    @prop({ required: true, ref: Tenant })
    tenant!: Ref<Tenant>;
    @prop({ ref: Tenant, required: true })
    createdBy!: Ref<Tenant>;
    @prop({ required: true })
    name!: string;
}
