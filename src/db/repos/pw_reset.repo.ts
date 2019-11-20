import { Document } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';

import { ReturnModelType } from '@typegoose/typegoose';

import { TempPasswordReset } from '../../entities/pw_reset.entity';
import { BaseRepository } from './base.repo';

export class TempPwResetRepository extends BaseRepository<
	TempPasswordReset,
	TempPasswordReset & Document
> {
	constructor(
		@InjectModel(TempPasswordReset)
		private readonly _entity: ReturnModelType<typeof TempPasswordReset>
	) {
		super(_entity, () => new TempPasswordReset());
	}
}
