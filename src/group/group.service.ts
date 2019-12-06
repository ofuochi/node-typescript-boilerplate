import { ConflictException, Injectable } from "@nestjs/common";

import { BaseService } from "../shared/services/base.service";
import { CreateGroupInput } from "./dto/CreateGroupInput";
import { Group } from "./group.entity";
import { GroupRepository } from "./group.repo";

@Injectable()
export class GroupService extends BaseService {
	constructor(private readonly _grpRepository: GroupRepository) {
		super();
	}
	async create(input: CreateGroupInput) {
		let grp = await this._grpRepository.findOneByQuery({ title: input.title });
		if (grp)
			throw new ConflictException(
				`Group with name ${input.title} already exists`
			);

		grp = Group.createInstance(input);
		return this._grpRepository.insertOrUpdate(grp);
	}
}
