import {
	arrayProp,
	getModelForClass,
	index,
	modelOptions,
	prop,
	Ref
} from "@typegoose/typegoose";

import { schemaConst } from "../shared/constants/entity.constant";
import { BaseEntity } from "../shared/entities/base.entity";
import { Writable } from "../shared/utils/writable";
import { Tenant } from "../tenant/tenant.entity";
import { IMustHaveTenant } from "../tenant/tenant.interface";
import { User } from "../user/user.entity";

export const DEFAULT_GRP_SIZE = 5;
export const MIN_GRP_SIZE = 1;
export const MAX_GRP_SIZE = 255;

@modelOptions({ options: { customName: "groups" } })
@index({ title: 1, tenant: 1 }, { unique: true })
export class Group extends BaseEntity implements IMustHaveTenant {
	constructor(grp?: {
		title: string;
		size: number;
		goal: string;
		expiresAt: Date;
		isPublic: boolean;
	}) {
		super();
		if (!grp) return;

		this.title = grp.title;
		this.size = grp.size;
		this.description = grp.goal;
		this.expiresAt = grp.expiresAt;
		this.isPublic = grp.isPublic;
	}

	@prop({ ref: Tenant, unique: false, default: null })
	readonly tenant: Ref<Tenant | null> = null;

	@prop({
		required: true,
		uppercase: true,
		trim: true,
		unique: false,
		text: true,
		maxlength: schemaConst.MAX_NAME_LENGTH
	})
	readonly title!: string;

	@prop({ type: Boolean, default: false })
	readonly isPublic: boolean = false;
	@prop({
		types: Number,
		default: DEFAULT_GRP_SIZE,
		required: true,
		min: MIN_GRP_SIZE,
		max: MAX_GRP_SIZE
	})
	readonly size: number = DEFAULT_GRP_SIZE;

	@prop({
		maxlength: schemaConst.MAX_DESC_LENGTH,
		required: true,
		trim: true
	})
	readonly description!: string;

	@prop({
		required: true,
		type: Date
	})
	readonly expiresAt: Date = new Date(
		new Date().setFullYear(new Date().getFullYear() + 1)
	);
	@arrayProp({
		itemsRef: User,
		required: false
	})
	readonly members: Ref<User>[] = [];

	static createInstance(group: {
		title: string;
		size: number;
		goal: string;
		expiresAt: Date;
		isPublic: boolean;
	}) {
		return new Group(group);
	}

	update(entity: Partial<this>): void {
		if (entity.title) this.setName(entity.title);
		if (entity.size) this.setSize(entity.size);
		if (entity.description) this.setGoal(entity.description);
		if (entity.isPublic) (this as Writable<this>).isPublic = entity.isPublic;
	}
	/**
	 * Sets the size of a group.
	 * @param {number} size
	 * @memberof Group
	 */
	setSize(size: number) {
		(this as Writable<this>).size = size;
	}
	setName(title: string) {
		(this as Writable<this>).title = title;
	}
	setGoal(goal: string) {
		(this as Writable<this>).description = goal;
	}
	addMember(member: Ref<User>) {
		const index = this.members.indexOf(member);
		if (index < 0) this.members.push(member);
	}
	removeMember(member: Ref<User>) {
		const index = this.members.indexOf(member);
		if (index > -1) this.members.splice(index, 1);
	}

	setExpiryDate(expiresAt: Date) {
		(this as Writable<this>).expiresAt = expiresAt;
	}
	makePublic() {
		(this as Writable<this>).isPublic = true;
	}
	makePrivate() {
		(this as Writable<this>).isPublic = false;
	}
	static getModel() {
		return getModelForClass(this);
	}
}
