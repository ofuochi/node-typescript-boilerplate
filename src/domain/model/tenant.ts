import { prop, instanceMethod } from "@hasezoey/typegoose";
import { Expose } from "class-transformer";

import { BaseEntity } from "./base";
import { Writable } from "../utils/writable";

/**
 *
 *
 * @export
 * @class Tenant
 * @extends {BaseEntity}
 */
export class Tenant extends BaseEntity {
    @prop({ required: true, default: "Tenant" })
    readonly type: string = "Tenant";
    /**
     * Gets the name of the tenant
     *
     * @type {string}
     * @memberof Tenant
     */
    @prop({
        required: true,
        uppercase: true,
        index: true,
        unique: true
    })
    @Expose()
    readonly name!: string;
    /**
     * Gets the description of the tenant
     *
     * @type {string}
     * @memberof Tenant
     */
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

    /**
     * Creates and returns a new instance of Tenant
     *
     * @static
     * @memberof Tenant
     */
    static createInstance = (name: string, description: string) =>
        new Tenant({
            name: name.replace(/\s/g, "").toUpperCase(),
            description
        });

    /**
     * Returns the Tenant Typegoose model
     *
     * @readonly
     * @static
     * @memberof Tenant
     */
    public static get model() {
        return new Tenant().getModelForClass(Tenant, {
            schemaOptions: { collection: "Tenants", timestamps: true }
        });
    }

    /**
     * Sets the name of the tenant
     *
     * @param {string} name
     * @memberof Tenant
     */
    @instanceMethod
    setName(name: string) {
        (this as Writable<Tenant>).name = name;
    }

    /**
     * Sets the description of the tenant
     *
     * @param {string} description
     * @memberof Tenant
     */
    @instanceMethod
    setDescription(description: string) {
        (this as Writable<Tenant>).description = description;
    }

    /**
     * Sets an update on the tenant's name and/or description
     *
     * @param {Partial<this>} tenant
     * @memberof Tenant
     */
    @instanceMethod
    update(tenant: Partial<this>): void {
        if (tenant.name)
            this.setName(tenant.name
                .replace(/\s/g, "")
                .toUpperCase() as string);
        if (tenant.description)
            this.setDescription(tenant.description as string);
    }
}
