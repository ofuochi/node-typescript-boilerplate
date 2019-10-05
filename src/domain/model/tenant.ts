import { prop } from "@hasezoey/typegoose";

import BaseEntity from "./base";
import { Writable } from "../utils/writable";

export default class Tenant extends BaseEntity<Tenant> {
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
            schemaOptions: { collection: "Tenants", timestamps: true }
        });
    }

    setName = (name: string) => {
        (this as Writable<Tenant>).name = name;
    };
    setDescription = (desc: string) => {
        (this as Writable<Tenant>).description = desc;
    };
}
