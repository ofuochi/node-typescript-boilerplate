import {
	getModelForClass,
	index,
	modelOptions,
	prop,
	Ref,
	ReturnModelType
} from "@typegoose/typegoose";

import { BaseEntity } from "../shared/entities/base.entity";
import { Writable } from "../shared/utils/writable";
import { Tenant } from "../tenant/tenant.entity";
import { IMustHaveTenant } from "../tenant/tenant.interface";
import { schemaConsts } from "../shared/constants/entity.constant";

@modelOptions({ options: { customName: "roles" } })
@index({ name: 1, tenant: 1 }, { unique: true })
export class Role extends BaseEntity implements IMustHaveTenant {
	@prop({ ref: Tenant, unique: false, default: null })
	readonly tenant: Ref<Tenant | null> = null;

	@prop({
		required: true,
		uppercase: true,
		trim: true,
		unique: false,
		text: true,
		maxlength: schemaConsts.MAX_DESC_LENGTH
	})
	readonly name!: string;
	@prop({ required: true, trim: true, maxlength: schemaConsts.MAX_DESC_LENGTH })
	readonly description!: string;

	constructor(arg?: { name: string; description: string; tenant?: any }) {
		super();
		if (!arg) return;

		const { name, description, tenant } = arg;
		this.name = name;
		this.description = description;
		this.tenant = tenant;
	}
	static createInstance = (name: string, description: string) =>
		new Role({
			name: name.replace(/\s/g, "").toUpperCase(),
			description
		});

	static getModel(): ReturnModelType<typeof Role> {
		return getModelForClass(this);
	}

	setName(name: string) {
		(this as Writable<Role>).name = name;
	}

	/**
	 * Sets the description of the tenant
	 *
	 * @param {string} description
	 * @memberof Role
	 */
	setDescription(description: string) {
		(this as Writable<Role>).description = description;
	}

	/**
	 * Sets an update on the tenant's name and/or description
	 *
	 * @param {Partial<this>} tenant
	 * @memberof Role
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
