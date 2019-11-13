import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose'

import { User } from '../user/user.entity'
import { BaseEntity } from '../base.entity'

@modelOptions({ options: { customName: "temp_password_resets" } })
export class Temp_PasswordReset extends BaseEntity {
	readonly token: string;
	@prop({ type: Date, expires: 3600 })
	readonly createdAt: Date;

	@prop({ ref: User, unique: true })
	readonly user: Ref<User>;

	constructor(args?: { user: any; token: string }) {
		super();
		if (!args) return;
		const { token, user } = args;
		this.token = token;
		this.user = user;
	}
	static createInstance(user: any, token: string) {
		return new this({ user, token });
	}
	public static getModel() {
		return getModelForClass(this);
	}
	update(entity: Partial<this>): void {}
}
