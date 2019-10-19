import { index, instanceMethod, prop, Ref } from "@hasezoey/typegoose";
import { iocContainer } from "../../infrastructure/config/ioc";
import { TYPES } from "../constants/types";
import { Writable } from "../utils/writable";
import { BaseEntity } from "./base";
import { IMustHaveTenant } from "./interfaces/entity";
import { Tenant } from "./tenant";

export const MAX_NAME_LENGTH = 225;
export const PASSWORD_SALT_ROUND = 12;

export enum UserRole {
    USER = "user",
    ADMIN = "admin"
}

@index({ email: 1, tenant: 1 }, { unique: true })
@index({ username: 1, tenant: 1 }, { unique: true })
export class User extends BaseEntity implements IMustHaveTenant {
    @prop({ required: true, default: "User" })
    readonly type: string = "User";
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

    public constructor(arg?: {
        firstName: string;
        lastName: string;
        email: string;
        username: string;
        password: string;
        tenant: Ref<Tenant>;
    }) {
        super();
        if (!arg) return;
        const { firstName, lastName, email, username, password, tenant } = arg;
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
        tenantId?: string;
    }) => {
        const id = tenantId || iocContainer.get<any>(TYPES.TenantId);

        if (!id) throw new Error("Tenant Id is required");

        return new User({
            firstName,
            lastName,
            email,
            username,
            password,
            tenant: id
        });
    };
    public static get model() {
        return new User().getModelForClass(User, {
            schemaOptions: { collection: "Users", timestamps: true }
        });
    }

    @instanceMethod
    setRole(role: UserRole) {
        (this as Writable<User>).role = role;
    }

    @instanceMethod
    setEmail(email: string) {
        (this as Writable<User>).email = email;
    }

    @instanceMethod
    setUsername(username: string) {
        (this as Writable<User>).username = username;
    }

    @instanceMethod
    setFirstName(firstName: string) {
        (this as Writable<User>).firstName = firstName;
    }

    @instanceMethod
    setLastName(lastName: string) {
        (this as Writable<User>).lastName = lastName;
    }

    @instanceMethod
    setPassword(password: string) {
        (this as Writable<User>).password = password;
    }
    @instanceMethod
    update(user: Partial<this>): void {
        if (this.firstName) this.setFirstName(user.firstName as string);
        if (this.lastName) this.setLastName(user.lastName as string);
        if (this.password) this.setPassword(user.password as string);
        if (this.username) this.setUsername(user.username as string);
        if (this.email) this.setEmail(user.email as string);
        if (this.role) this.setRole(user.role as UserRole);
    }
}
