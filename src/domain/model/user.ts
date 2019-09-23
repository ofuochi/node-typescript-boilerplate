import { arrayProp, prop, Ref } from "@hasezoey/typegoose";

import BaseEntity from "./base";
import { IMustHaveTenant, IActiveStatus } from "./interfaces/entity";
import Tenant from "./tenant";
import { Writable } from "../utils/writable";

export const MAX_NAME_LENGTH = 225;

export class User extends BaseEntity implements IMustHaveTenant, IActiveStatus {
    @prop({ required: true, ref: Tenant })
    readonly tenant!: Ref<Tenant>;

    @prop({ required: true, maxlength: MAX_NAME_LENGTH, trim: true })
    readonly firstName!: string;
    @prop({ required: true, maxlength: MAX_NAME_LENGTH, trim: true })
    readonly lastName!: string;

    @prop({
        required: true,
        maxlength: MAX_NAME_LENGTH,
        trim: true,
        lowercase: true,
        unique: true,
        index: true
    })
    readonly username!: string;

    @prop({
        required: true,
        maxlength: MAX_NAME_LENGTH,
        trim: true,
        lowercase: true,
        unique: true,
        index: true
    })
    readonly email!: string;
    @prop({ required: true, maxlength: MAX_NAME_LENGTH })
    readonly password!: string;

    @arrayProp({
        required: true,
        default: "User",
        items: String,
        index: true
    })
    readonly roles: string[] = ["User"];

    @prop({ required: true, default: true })
    readonly isActive: boolean = true;

    private constructor({});
    private constructor({
        firstName,
        lastName,
        email,
        username,
        password,
        tenant
    }: {
        firstName: string;
        lastName: string;
        email: string;
        username: string;
        password: string;
        tenant: Tenant;
    }) {
        super();
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.password = password;
        this.tenant = tenant;
    }
    static createInstance = ({
        firstName,
        lastName,
        email,
        username,
        password
    }: {
        firstName: string;
        lastName: string;
        email: string;
        username: string;
        password: string;
    }) =>
        new User({
            firstName,
            lastName,
            email,
            username,
            password,
            tenant: global.currentUser.tenant.id
        });

    public static get model() {
        return new User({}).getModelForClass(User, {
            schemaOptions: { collection: "Users" }
        });
    }
    deactivate = (): void => {
        (this as Writable<User>).isActive = false;
    };
}
