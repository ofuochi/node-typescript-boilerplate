import { InjectModel } from 'nestjs-typegoose';

import { Injectable, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';

import { Tenant } from '../tenant/tenant.entity';
import { User } from '../user/user.entity';

@Injectable()
export class DbService {
	constructor(
		@InjectModel(Tenant)
		private readonly _tenantRepository: ReturnModelType<typeof Tenant>,
		@InjectModel(User)
		private readonly _userRepository: ReturnModelType<typeof User>
	) {}
}
