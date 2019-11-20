import { getModelForClass, index, modelOptions, prop, Ref } from '@typegoose/typegoose';

import { BaseEntity } from '../base.entity';
import { User } from '../user/user.entity';

export const PW_RESET_EXPIRY_SECS = 1;
@modelOptions({ options: { customName: "temp_password_resets" } })
@index({ createdAt: 1 }, { expireAfterSeconds: PW_RESET_EXPIRY_SECS })
export class TempPasswordReset extends BaseEntity {
	@prop({ maxlength: 50, type: String, required: true })
	readonly token!: string;

	@prop({ ref: User, unique: true, required: true })
	readonly user!: Ref<User>;

	constructor(args?: { userId: any; token: string }) {
		super();
		if (!args) return;
		const { token, userId: user } = args;
		this.token = token;
		this.user = user;
	}
	static createInstance(userId: any, token: string) {
		return new this({ userId, token });
	}
	public static getModel() {
		return getModelForClass(this);
	}
	update(entity: Partial<this>): void {}
}
