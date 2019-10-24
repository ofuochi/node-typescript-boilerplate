import { index, instanceMethod, prop, Ref } from "@hasezoey/typegoose";
import { config } from "../../infrastructure/config";
import { iocContainer } from "../../infrastructure/config/ioc";
import { TYPES } from "../constants/types";
import { Writable } from "../utils/writable";
import { BaseEntity } from "./base";
import { IMustHaveTenant } from "./interfaces/must_have_tenant";
import { Tenant } from "./tenant";
import { inc, set } from "../data/db_operators";

export const MAX_NAME_LENGTH = 225;
export const PASSWORD_SALT_ROUND = 12;

/**
 *
 *
 * @export
 * @enum {number}
 */
export enum UserRole {
    USER = "user",
    ADMIN = "admin"
}

/**
 *
 *
 * @export
 * @class User
 * @extends {BaseEntity}
 * @implements {IMustHaveTenant}
 */
@index({ email: 1, tenant: 1 }, { unique: true })
@index({ username: 1, tenant: 1 }, { unique: true })
export class User extends BaseEntity implements IMustHaveTenant {
    /**
     *Gets the type of the user
     *
     * @type {string}
     * @memberof User
     */
    @prop({ required: true, default: "User" })
    readonly type: string = "User";
    /**
     * Gets the firstName of the user
     *
     * @type {string}
     * @memberof User
     */
    @prop({ required: true, maxlength: MAX_NAME_LENGTH, trim: true })
    readonly firstName!: string;
    /**
     * Get the lastName of the user
     *
     * @type {string}
     * @memberof User
     */
    @prop({ required: true, maxlength: MAX_NAME_LENGTH, trim: true })
    readonly lastName!: string;

    @prop({ required: true, ref: Tenant, unique: false })
    readonly tenant!: Ref<Tenant>;
    /**
     * Gets the username of the user
     *
     * @type {string}
     * @memberof User
     */
    @prop({
        required: true,
        maxlength: MAX_NAME_LENGTH,
        trim: true,
        lowercase: true,
        unique: false
    })
    readonly username!: string;

    /**
     * Gets the email address of the user
     *
     * @type {string}
     * @memberof User
     */
    @prop({
        required: true,
        maxlength: MAX_NAME_LENGTH,
        trim: true,
        lowercase: true,
        unique: false
    })
    readonly email!: string;

    /**
     * Gets'the password hash of the user
     *
     * @type {string}
     * @memberof User
     */
    @prop({ required: true, maxlength: MAX_NAME_LENGTH })
    readonly password!: string;

    /**
     * Gets the role assigned to the user
     *
     * @type {UserRole}
     * @memberof User
     */
    @prop({
        enum: UserRole,
        required: true,
        default: UserRole.USER
    })
    readonly role: UserRole = UserRole.USER;

    /**
     * Gets the current number of consecutive failed signin attempts of the user
     *
     * @type {number}
     * @memberof User
     */
    @prop({ required: true, default: 0 })
    readonly failedSignInAttempts: number;

    /**
     * Gets the date and time through which the user will be locked out if the user is currently locked out
     *
     * @type {Date}
     * @memberof User
     */
    @prop({ default: undefined })
    readonly lockOutEndDate?: Date;

    /**
     * Returns true if the user is currently locked out
     *
     * @readonly
     * @type {boolean}
     * @memberof User
     */
    get isLockedOut(): boolean {
        return (
            this.failedSignInAttempts >= config.userLockout.maxSignInAttempts &&
            this.lockOutEndDate !== undefined &&
            this.lockOutEndDate > new Date()
        );
    }

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

    /**
     * Creates and returns a new instance of User
     *
     * @static
     * @memberof User
     */
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

    /**
     * Returns the User Typegoose model
     *
     * @readonly
     * @static
     * @memberof User
     */
    public static get model() {
        const model = new User().getModelForClass(User, {
            schemaOptions: { collection: "Users", timestamps: true }
        });

        model.collection.createIndex({
            firstName: "text",
            lastName: "text",
            email: "text",
            username: "text"
        });
        return model;
    }

    /**
     * returns an update to be sent to the database for a particular user when a signin is attepted on that user
     *
     * @static
     * @returns {{ [key: string]: object }}
     * @memberof User
     */
    static getSignInAttemptUpdate(): { [key: string]: object } {
        const endDate = new Date();
        endDate.setMinutes(
            endDate.getMinutes() + config.userLockout.lockoutTime
        );
        return {
            ...inc({ failedSignInAttempts: 1 }),
            ...set({ lockOutEndDate: endDate })
        };
    }

    /**
     * Sets the role of the user
     *
     * @param {UserRole} role
     * @memberof User
     */
    @instanceMethod
    setRole(role: UserRole) {
        (this as Writable<User>).role = role;
    }

    /**
     * Sets the email address of the user
     *
     * @param {string} email
     * @memberof User
     */
    @instanceMethod
    setEmail(email: string) {
        (this as Writable<User>).email = email;
    }

    /**
     * Sets the username of the user
     *
     * @param {string} username
     * @memberof User
     */
    @instanceMethod
    setUsername(username: string) {
        (this as Writable<User>).username = username;
    }

    /**
     * Sets the firstName of the user
     *
     * @param {string} firstName
     * @memberof User
     */
    @instanceMethod
    setFirstName(firstName: string) {
        (this as Writable<User>).firstName = firstName;
    }

    /**
     * Sets the lastName of the user
     *
     * @param {string} lastName
     * @memberof User
     */
    @instanceMethod
    setLastName(lastName: string) {
        (this as Writable<User>).lastName = lastName;
    }

    /**
     * Sets the password hash of the user
     *
     * @param {string} password
     * @memberof User
     */
    @instanceMethod
    setPassword(password: string) {
        (this as Writable<User>).password = password;
    }

    /**
     * Sets the reference to the tenant to which the user belongs
     *
     * @param {*} tenant
     * @memberof User
     */
    @instanceMethod
    setTenant(tenant: any) {
        (this as Writable<this>).tenant = tenant;
    }
    /**
     * Updates the properties of the user which can be updated
     *
     * @param {Partial<this>} user
     * @memberof User
     */
    @instanceMethod
    update(user: Partial<this>): void {
        if (user.firstName) this.setFirstName(user.firstName as string);
        if (user.lastName) this.setLastName(user.lastName as string);
        if (user.password) this.setPassword(user.password as string);
        if (user.username) this.setUsername(user.username as string);
        if (user.email) this.setEmail(user.email as string);
        if (user.role) this.setRole(user.role as UserRole);
    }

    /**
     * Clears the failedSigninAttempts and lockOutEndDate of the user to their defaults
     *
     * @memberof User
     */
    @instanceMethod
    clearLockOut() {
        (this as Writable<User>).lockOutEndDate = undefined;
        (this as Writable<User>).failedSignInAttempts = 0;
    }
}
