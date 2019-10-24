import { getModelForClass, prop, modelOptions } from "@typegoose/typegoose";
import { Expose } from "class-transformer";
import { Writable } from "../utils/writable";
import { BaseEntity } from "./base";

@modelOptions({ options: { customName: "tenants" } })
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

    public static getModel() {
        return getModelForClass(this);
    }

    setName(name: string) {
        (this as Writable<Tenant>).name = name;
    }

    setDescription(description: string) {
        (this as Writable<Tenant>).description = description;
    }

    update(tenant: Partial<this>): void {
        if (tenant.name)
            this.setName(tenant.name
                .replace(/\s/g, "")
                .toUpperCase() as string);
        if (tenant.description)
            this.setDescription(tenant.description as string);
    }
}
