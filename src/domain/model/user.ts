import { prop, Ref } from "@hasezoey/typegoose";
import { IsEnum } from "class-validator";

import { Writable } from "../utils/writable";
import BaseEntity from "./base";
import { IActiveStatus, IMustHaveTenant } from "./interfaces/entity";
import Tenant from "./tenant";

export const MAX_NAME_LENGTH = 225;
export enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
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

    @prop({ required: true, enum: UserRole, default: UserRole.USER })
    readonly role: UserRole = UserRole.USER;

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
        password,
        tenantId
    }: {
        firstName: string;
        lastName: string;
        email: string;
        username: string;
        password: string;
        tenantId: string;
    }) => {
        if (!tenantId) throw new Error("Tenant Id is required");
        return new User({
            firstName,
            lastName,
            email,
            username,
            password,
            tenant: tenantId
        });
    };
    public static get model() {
        return new User({}).getModelForClass(User, {
            schemaOptions: { collection: "Users" }
        });
    }

    setRole = (role: UserRole) => {
        (this as Writable<User>).role = role;
    };
}
