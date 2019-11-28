import {
	arrayProp,
	getModelForClass,
	index,
	modelOptions,
	prop,
	Ref
} from "@typegoose/typegoose";

import { BaseEntity } from "../shared/entities/base.entity";
import { Tenant } from "../tenant/tenant.entity";
import { IMustHaveTenant } from "../tenant/tenant.interface";
import { Writable } from "../shared/utils/writable";
import { Expose } from "class-transformer";

export const MAX_NAME_LENGTH = 225;
export const PASSWORD_SALT_ROUND = 12;

export enum UserRole {
	USER = "User",
	ADMIN = "Admin",
	HOST = "Host"
}

@modelOptions({ options: { customName: "users" } })
@index({ email: 1, tenant: 1 }, { unique: true })
@index({ username: 1, tenant: 1 }, { unique: true })
export class User extends BaseEntity implements IMustHaveTenant {
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

	@prop({ ref: Tenant, unique: false, default: null })
	readonly tenant: Ref<Tenant | null> = null;

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
		text: true,
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
		text: true,
		unique: false
	})
	readonly email!: string;

	/**
	 * Gets the password hash of the user
	 *
	 * @type {string}
	 * @memberof User
	 */
	@prop({ required: true, maxlength: MAX_NAME_LENGTH })
	readonly password!: string;

	/**
	 * Gets the roles assigned to the user
	 *
	 * @type {UserRole}
	 * @memberof User
	 */
	@arrayProp({
		enum: UserRole,
		items: String,
		required: true,
		default: UserRole.USER
	})
	readonly roles: UserRole[] = [UserRole.USER];

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
	 * Specifies whether the user's email has been verified or not
	 *
	 * @type {boolean}
	 * @memberof BaseEntity
	 */
	@prop({ required: true, default: false })
	readonly isEmailVerified: boolean = false;
	/**
	 * Returns true if the user is currently locked out
	 *
	 * @readonly
	 * @type {boolean}
	 * @memberof User
	 */
	// get isLockedOut(): boolean {
	//   return (
	//     this.failedSignInAttempts >= config.userLockout.maxSignInAttempts &&
	//     this.lockOutEndDate !== undefined &&
	//     this.lockOutEndDate > new Date()
	//   );
	// }

	constructor(arg?: {
		firstName: string;
		lastName: string;
		email: string;
		username: string;
		password: string;
		tenant?: any;
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
		tenant
	}: {
		firstName: string;
		lastName: string;
		email: string;
		username: string;
		password: string;
		tenant?: any;
	}) => {
		return new User({
			firstName,
			lastName,
			email,
			username,
			password,
			tenant
		});
	};
	public static getModel() {
		return getModelForClass(this);
	}

	/**
	 * returns an update to be sent to the database for a particular user when a signin is attepted on that user
	 *
	 * @static
	 * @returns {{ [key: string]: object }}
	 * @memberof User
	 */
	// static getSignInAttemptUpdate(): { [key: string]: object } {
	//   const endDate = new Date();
	//   endDate.setMinutes(endDate.getMinutes() + config.userLockout.lockoutTime);
	//   return {
	//     ...inc({ failedSignInAttempts: 1 }),
	//     ...set({ lockOutEndDate: endDate }),
	//   };
	// }

	/**
	 * Sets the role of the user
	 *
	 * @param {UserRole} role
	 * @memberof User
	 */
	setRoles(...roles: UserRole[]) {
		(this as Writable<User>).roles = roles;
	}

	/**
	 * Sets the email address of the user
	 *
	 * @param {string} email
	 * @memberof User
	 */
	setEmail(email: string) {
		(this as Writable<User>).email = email;
	}

	/**
	 * Sets the username of the user
	 *
	 * @param {string} username
	 * @memberof User
	 */
	setUsername(username: string) {
		(this as Writable<User>).username = username;
	}

	/**
	 * Sets the firstName of the user
	 *
	 * @param {string} firstName
	 * @memberof User
	 */
	setFirstName(firstName: string) {
		(this as Writable<User>).firstName = firstName;
	}

	/**
	 * Sets the lastName of the user
	 *
	 * @param {string} lastName
	 * @memberof User
	 */
	setLastName(lastName: string) {
		(this as Writable<User>).lastName = lastName;
	}

	/**
	 * Sets the password hash of the user
	 *
	 * @param {string} password
	 * @memberof User
	 */
	setPassword(password: string) {
		(this as Writable<User>).password = password;
	}

	/**
	 * Sets the reference to the tenant to which the user belongs
	 *
	 * @param {*} tenant
	 * @memberof User
	 */
	setTenant(tenant: any) {
		(this as Writable<this>).tenant = tenant;
	}
	/**
	 * Updates the properties of the user which can be updated
	 *
	 * @param {Partial<this>} user
	 * @memberof User
	 */
	update(user: Partial<this>): void {
		if (user.firstName) {
			this.setFirstName(user.firstName as string);
		}
		if (user.lastName) {
			this.setLastName(user.lastName as string);
		}
		if (user.password) {
			this.setPassword(user.password as string);
		}
		if (user.username) {
			this.setUsername(user.username as string);
		}
		if (user.email) {
			this.setEmail(user.email as string);
		}
		if (user.roles) {
			this.setRoles(...(user.roles as UserRole[]));
		}
	}
	verifyEmail() {
		(this as Writable<User>).isEmailVerified = true;
	}
	/**
	 * Returns true if the user is currently locked out
	 *
	 * @readonly
	 * @type {boolean}
	 * @memberof User
	 */
	isLockedOut(maxLoginAttempts: number): boolean {
		return (
			this.failedSignInAttempts >= maxLoginAttempts &&
			this.lockOutEndDate !== undefined &&
			this.lockOutEndDate.getTime() > Date.now()
		);
	}
	/**
	 * Clears the failedSigninAttempts and lockOutEndDate of the user to their defaults
	 *
	 * @memberof User
	 */
	clearLockOut() {
		(this as Writable<User>).lockOutEndDate = undefined;
		(this as Writable<User>).failedSignInAttempts = 0;
	}

	/**
	 * returns an update to be sent to the database for a particular user when a signin is attempted on that user
	 *
	 * @static
	 * @returns {{ [key: string]: object }}
	 * @memberof User
	 */
	static getSignInAttemptUpdate(
		lockoutDurationMinutes: number
	): { [key: string]: object } {
		const endDate = new Date();
		endDate.setMinutes(endDate.getMinutes() + lockoutDurationMinutes);
		return {
			$inc: { failedSignInAttempts: 1 },
			$set: { lockOutEndDate: endDate }
		};
	}
}
