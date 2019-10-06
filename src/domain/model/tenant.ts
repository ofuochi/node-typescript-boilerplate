import { prop, instanceMethod } from "@hasezoey/typegoose";
import { Expose } from "class-transformer";

import BaseEntity from "./base";
import { Writable } from "../utils/writable";

export default class Tenant extends BaseEntity {
    @prop({
        required: true,
        uppercase: true,
        index: true,
        unique: true
    })
    @Expose()
    readonly name!: string;
    @prop({ required: true })
    @Expose()
    readonly description!: string;

    constructor(name?: string, description?: string) {
        super();
        this.name = name || '';
        this.description = description || '';
    }

    static createInstance = (name: string, description: string) =>
        new Tenant(name.replace(/\s/g, "").toUpperCase(), description);

    public static get model() {
        return new Tenant().getModelForClass(Tenant, {
            schemaOptions: { collection: "Tenants", timestamps: true }
        });
    }

    @instanceMethod
    setName(name: string) {
        (this as Writable<Tenant>).name = name;
    };
    
    @instanceMethod
    setDescription(description: string) {
        (this as Writable<Tenant>).description = description;
    };
}
