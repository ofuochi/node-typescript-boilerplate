import { Document } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';

import { ReturnModelType } from '@typegoose/typegoose';

import { BaseRepository } from '../../db/repos/base.repo';
import { Tenant } from '../tenant.entity';
import { ITenantRepository } from './interfaces';

export type TenantModel = Tenant & Document;

export class TenantRepository extends BaseRepository<Tenant, TenantModel>
	implements ITenantRepository {
	public constructor(
		@InjectModel(Tenant)
		private readonly _tenantModel: ReturnModelType<typeof Tenant>
	) {
		super(_tenantModel, () => new Tenant());
	}
}
