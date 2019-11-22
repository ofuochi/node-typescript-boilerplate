import { Document } from "mongoose";
import { InjectModel } from "nestjs-typegoose";

import { ReturnModelType } from "@typegoose/typegoose";

import { TempToken } from "../../entities/temp_token.entity";
import { BaseRepository } from "./base.repo";

export class TempPwResetRepository extends BaseRepository<
	TempToken,
	TempToken & Document
> {
	constructor(
		@InjectModel(TempToken)
		private readonly _entity: ReturnModelType<typeof TempToken>
	) {
		super(_entity, () => new TempToken());
	}
}
