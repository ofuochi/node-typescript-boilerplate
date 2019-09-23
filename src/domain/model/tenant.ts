import { prop } from "@hasezoey/typegoose";

import { Writable } from "../utils/writable";
import BaseEntity from "./base";
import { IActiveStatus } from "./interfaces/entity";

export default class Tenant extends BaseEntity implements IActiveStatus {
    @prop({
        required: true,
        uppercase: true,
        index: true,
        unique: true
    })
    readonly name!: string;
    @prop({ required: true })
    readonly description!: string;
    @prop({ required: true, default: true })
    readonly isActive: boolean = true;

    private constructor(name?: any, description?: any);
    private constructor(name: string, description: string) {
        super();
        this.name = name;
        this.description = description;
    }

    static createInstance = (name: string, description: string) =>
        new Tenant(name, description);
    deactivate = (): void => {
        (this as Writable<Tenant>).isActive = false;
    };
    public static get model() {
        return new Tenant().getModelForClass(Tenant, {
            schemaOptions: { collection: "Tenants" }
        });
    }
}
