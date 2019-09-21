import { prop } from "@hasezoey/typegoose";

import BaseEntity from "./base";

export default class Tenant extends BaseEntity {
    @prop({ required: true })
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
        new Tenant(name, description);
    public static get model() {
        return new Tenant().getModelForClass(Tenant);
    }
}
