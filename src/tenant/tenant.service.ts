import { ConflictException, Injectable } from "@nestjs/common";

import { TenantRepository } from "./repository/tenant.repository";
import { Tenant } from "./tenant.entity";

@Injectable()
export class TenantService {
	constructor(private readonly _tenantRepository: TenantRepository) {}
	async create(name: string, description: string) {
		let tenant = await this._tenantRepository.findOneByQuery({ name });
		console.warn(tenant);
		if (tenant)
			throw new ConflictException(`Tenant with name ${name} already exists`);

		tenant = Tenant.createInstance(name, description);
		return this._tenantRepository.insertOrUpdate(tenant);
	}
}
