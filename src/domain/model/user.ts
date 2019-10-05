import { index, prop, Ref, pre } from "@hasezoey/typegoose";

import { Writable } from "../utils/writable";
import BaseEntity from "./base";
import { IMustHaveTenant } from "./interfaces/entity";
import Tenant from "./tenant";

export const MAX_NAME_LENGTH = 225;
export enum UserRole {
    USER = "user",
    ADMIN = "admin"
}

@index({ email: 1, tenant: 1 }, { unique: true })
@index({ username: 1, tenant: 1 }, { unique: true })
// eslint-disable-next-line
@pre<User>("save", function(next) {
    if (global.currentUser.user) {
        this.setCreator(global.currentUser.user);
    }
    next();
})
export class User extends BaseEntity<User> implements IMustHaveTenant {
    @prop({ required: true, maxlength: MAX_NAME_LENGTH, trim: true })
    readonly firstName!: string;
    @prop({ required: true, maxlength: MAX_NAME_LENGTH, trim: true })
    readonly lastName!: string;

    @prop({ required: true, ref: Tenant, unique: false })
    readonly tenant!: Ref<Tenant>;
    @prop({
        required: true,
        maxlength: MAX_NAME_LENGTH,
        trim: true,
        lowercase: true,
        unique: false
    })
    readonly username!: string;

    @prop({
        required: true,
        maxlength: MAX_NAME_LENGTH,
        trim: true,
        lowercase: true,
        unique: false
    })
    readonly email!: string;

    @prop({ required: true, maxlength: MAX_NAME_LENGTH })
    readonly password!: string;

    @prop({
        enum: UserRole,
        required: true,
        default: UserRole.USER
    })
    readonly role: UserRole = UserRole.USER;

    private constructor({}); // eslint-disable-line
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
    }) => {
        const tenantId = global.currentUser.tenant.id;
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
            schemaOptions: { collection: "Users", timestamps: true }
        });
    }
    setCreator = (creator: User) => {
        (this as Writable<User>).createdBy = creator.id;
    };
    setRole = (role: UserRole) => {
        (this as Writable<User>).role = role;
    };
    setEmail = (email: string) => {
        (this as Writable<User>).email = email;
    };
    setUsername = (username: string) => {
        (this as Writable<User>).username = username;
    };
    setTenant = (tenant: Tenant) => {
        (this as Writable<User>).tenant = tenant.id;
    };
    setFirstName = (firstName: string) => {
        (this as Writable<User>).firstName = firstName;
    };
    setLastName = (lastName: string) => {
        (this as Writable<User>).lastName = lastName;
    };
    setPassword = (password: string) => {
        (this as Writable<User>).password = password;
    };
}
