import { BaseService } from "./../shared/services/base.service";
import { Injectable, ConflictException } from "@nestjs/common";
import { CreateGroupInput } from "./dto/CreateGroupInput";
import { GroupRepository } from "./group.repo";
import { Group } from "./group.entity";

@Injectable()
export class GroupService extends BaseService {
	constructor(private readonly _grpRepository: GroupRepository) {
		super();
	}
	async create(input: CreateGroupInput) {
		let grp = await this._grpRepository.findOneByQuery({ name: input.name });
		if (grp)
			throw new ConflictException(
				`Group with name ${input.name} already exists`
			);
		grp = Group.createInstance(input);
		return this._grpRepository.insertOrUpdate(grp);
	}
}
