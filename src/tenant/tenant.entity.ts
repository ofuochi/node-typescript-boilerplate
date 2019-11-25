import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { BaseEntity } from "../shared/entities/base.entity";
import { Writable } from "../shared/utils/writable";

/**
 *
 *
 * @export
 * @class Tenant
 * @extends {BaseEntity}
 */
@modelOptions({ options: { customName: "tenants" } })
export class Tenant extends BaseEntity {
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
		unique: true,
		text: true
	})
	readonly name!: string;
	/**
	 * Gets the description of the tenant
	 *
	 * @type {string}
	 * @memberof Tenant
	 */
	@prop({ required: true })
	readonly description!: string;

	constructor(arg?: { name: string; description: string }) {
		super();
		if (!arg) {
			return;
		}

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

	public static getModel() {
		return getModelForClass(this);
	}

	setName(name: string) {
		(this as Writable<Tenant>).name = name;
	}

	/**
	 * Sets the description of the tenant
	 *
	 * @param {string} description
	 * @memberof Tenant
	 */
	setDescription(description: string) {
		(this as Writable<Tenant>).description = description;
	}

	/**
	 * Sets an update on the tenant's name and/or description
	 *
	 * @param {Partial<this>} tenant
	 * @memberof Tenant
	 */
	update(tenant: Partial<this>): void {
		if (tenant.name) {
			this.setName(tenant.name.replace(/\s/g, "").toUpperCase() as string);
		}
		if (tenant.description) {
			this.setDescription(tenant.description as string);
		}
	}
}
