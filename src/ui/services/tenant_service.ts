import { injectable } from "inversify";

import { tenantRepository } from "../../domain/constants/decorators";
import { ITenantRepository } from "../../domain/interfaces/repositories";
import { ITenantService } from "../../domain/interfaces/services";
import Tenant from "../../domain/model/tenant";
import { TenantDto } from "../models/tenant_dto";

@injectable()
export default class TenantService implements ITenantService {
    @tenantRepository public _tenantRepository: ITenantRepository;

    private toDto(tenant: Tenant): TenantDto {
        const tenantDto: TenantDto = {
            name: tenant.name,
            description: tenant.description,
            isActive: tenant.isActive,
            id: tenant.id
        };
        return tenantDto;
    }

    async create(name: string, description: string): Promise<TenantDto> {
        const tenant = await this._tenantRepository.save(
            Tenant.createInstance(name, description)
        );
        return this.toDto(tenant);
    }

    async get(name: string): Promise<TenantDto | undefined> {
        const tenant = await this._tenantRepository.findOneByQuery({ name });
        return tenant == undefined ? undefined : this.toDto(tenant);
    }

    async search(name?: string): Promise<TenantDto[]> {
        const tenants = !!name
            ? await this._tenantRepository.findManyByQuery({ name })
            : await this._tenantRepository.findAll();
        return tenants.map(tenant => this.toDto(tenant));
    }
}
