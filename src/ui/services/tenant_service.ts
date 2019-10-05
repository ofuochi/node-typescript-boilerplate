import { injectable } from "inversify";

import { ITenantService } from "../../domain/interfaces/services";
import { tenantRepository } from "domain/constants/decorators";
import { ITenantRepository } from "domain/interfaces/repositories";
import { TenantDto } from "ui/models/tenant_dto";
import Tenant from "domain/model/tenant";

@injectable()
export default class TenantService implements ITenantService {
    @tenantRepository private _tenantRepository: ITenantRepository;

    private to_dto(tenant: Tenant): TenantDto {
        const tenantDto: TenantDto = {
            name: tenant.name,
            description: tenant.description,
            isActive: tenant.isActive,
            id: tenant.id
        };
        return tenantDto;
    }
    
    async create(name: string, description: string): Promise<TenantDto> {
        const tenant = await this._tenantRepository.save(Tenant.createInstance(name, description));
        return this.to_dto(tenant);
    }
    
    async get(name: string): Promise<TenantDto | undefined> {
        const tenant = await this._tenantRepository.findOneByQuery({ name });
        return tenant == undefined
            ? undefined
            : this.to_dto(tenant);
    }
    
    async search(name?: string): Promise<TenantDto[]> {
        const tenants =
            !!name
                ? await this._tenantRepository.findManyByQuery({ name })
                : await this._tenantRepository.findAll();
        return tenants.map(tenant => this.to_dto(tenant));
    }
}
