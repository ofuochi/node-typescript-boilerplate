import {
	ConflictException,
	Injectable,
	NotFoundException
} from "@nestjs/common";
import { TenantRepository } from "./repository/tenant.repository";
import { TenantDto } from "./tenant.dto";
import { Tenant } from "./tenant.entity";

@Injectable()
export class TenantService {
	constructor(private readonly _tenantRepository: TenantRepository) {}

	async deleteById(id: string) {
		await this._tenantRepository.deleteById(id);
	}

	async update(input: TenantDto) {
		const tenant = await this._tenantRepository.findById(input.id);
		if (!tenant)
			throw new NotFoundException(`Tenant with ID ${input.id} not found`);
		tenant.update(input);
		if (input.isActive) tenant.activate();
		else tenant.deactivate();
		await this._tenantRepository.insertOrUpdate(tenant);
	}
	async getTenantByName(name: string): Promise<Tenant> {
		const tenant = await this._tenantRepository.findOneByQuery({ name });
		if (tenant) return tenant;
		throw new NotFoundException(`Tenant with name ${name} does not exist`);
	}
	pagedGetAll({
		limit = 0,
		skip = 0,
		search
	}: {
		limit?: number;
		skip?: number;
		search?: string;
	}): Promise<{ totalCount: number; items: Tenant[] }> {
		return this._tenantRepository.pagedFindAll({ limit, skip, search });
	}

	async create(name: string, description: string) {
		let tenant = await this._tenantRepository.findOneByQuery({ name });
		if (tenant)
			throw new ConflictException(`Tenant with name ${name} already exists`);

		tenant = Tenant.createInstance(name, description);
		await this._tenantRepository.insertOrUpdate(tenant);
		return tenant;
	}
}
