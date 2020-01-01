import { TravelPackageService } from "./../travel-package/travel-package.service";
import {
	ConflictException,
	Injectable,
	NotFoundException
} from "@nestjs/common";

import { BaseService } from "../shared/services/base.service";
import { CreateGroupInput } from "./dto/CreateGroupInput";
import { Group } from "./group.entity";
import { GroupRepository } from "./group.repo";

@Injectable()
export class GroupService extends BaseService {
	constructor(
		private readonly _grpRepository: GroupRepository,
		private readonly _travelPackageService: TravelPackageService
	) {
		super();
	}
	async create(input: CreateGroupInput) {
		let grp = await this._grpRepository.findOneByQuery({ title: input.title });
		if (grp)
			throw new ConflictException(
				`Group with name ${input.title} already exists`
			);

		const travelPackage = await this._travelPackageService.get(input.package);
		if (!travelPackage)
			throw new NotFoundException(
				`Package with ID ${input.package} does not exist`
			);

		grp = Group.createInstance(input);
		return this._grpRepository.insertOrUpdate(grp);
	}
}
