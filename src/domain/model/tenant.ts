import { prop } from "@hasezoey/typegoose";

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

    private constructor(name?: any, description?: any);
    private constructor(name: string, description: string) {
        super();
        this.name = name;
        this.description = description;
    }

    static createInstance = (name: string, description: string) =>
        new Tenant(name.replace(/\s/g, "").toUpperCase(), description);

    public static get model() {
        return new Tenant().getModelForClass(Tenant, {
            schemaOptions: { collection: "Tenants" }
        });
    }
}
