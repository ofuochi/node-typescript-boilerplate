import { Injectable, ConflictException } from "@nestjs/common";
import { Role } from "./role.entity";
import { RoleRepository } from "./role.repo";

@Injectable()
export class RoleService {
	constructor(private readonly _roleRepository: RoleRepository) {}

	async create(name: string, description: string): Promise<Role> {
		let role = await this._roleRepository.findOneByQuery({ name });
		if (role)
			throw new ConflictException(`role with name ${name} already exists`);

		role = Role.createInstance(name, description);
		return this._roleRepository.insertOrUpdate(role);
	}
}
