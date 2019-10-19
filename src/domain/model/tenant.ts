import { prop, instanceMethod } from "@hasezoey/typegoose";
import { Expose } from "class-transformer";

import { BaseEntity } from "./base";
import { Writable } from "../utils/writable";

export class Tenant extends BaseEntity {
    @prop({ required: true, default: "Tenant" })
    readonly type: string = "Tenant";
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

    constructor(arg?: { name: string; description: string }) {
        super();
        if (!arg) return;

        const { name, description } = arg;
        this.name = name;
        this.description = description;
    }

    static createInstance = (name: string, description: string) =>
        new Tenant({
            name: name.replace(/\s/g, "").toUpperCase(),
            description
        });

    public static get model() {
        return new Tenant().getModelForClass(Tenant, {
            schemaOptions: { collection: "Tenants", timestamps: true }
        });
    }

    @instanceMethod
    setName(name: string) {
        (this as Writable<Tenant>).name = name;
    }

    @instanceMethod
    setDescription(description: string) {
        (this as Writable<Tenant>).description = description;
    }

    @instanceMethod
    update(tenant: Partial<this>): void {
        if (this.name) this.setName(tenant.name as string);
        if (this.description) this.setDescription(tenant.description as string);
    }
}
