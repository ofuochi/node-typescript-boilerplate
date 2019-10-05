import { injectable } from "inversify";

import { tenantRepository, autoMapper } from "domain/constants/decorators";
import { ITenantRepository } from "domain/interfaces/repositories";
import { TenantDto } from "ui/models/tenant_dto";
import { ITenantService } from "ui/interfaces/tenant_service";
import Tenant from "domain/model/tenant";
import { AutoMapper } from "automapper-nartc";

@injectable()
export default class TenantService implements ITenantService {
    @autoMapper public _mapper: AutoMapper;
    @tenantRepository public _tenantRepository: ITenantRepository;
    
    async create(name: string, description: string): Promise<TenantDto> {
        const tenant = await this._tenantRepository.save(Tenant.createInstance(name, description));
        return this._mapper.map(tenant, TenantDto);
    }
    
    async get(name: string): Promise<TenantDto | undefined> {
        const tenant = await this._tenantRepository.findOneByQuery({ name });
        return tenant == undefined
            ? undefined
            : this._mapper.map(tenant, TenantDto);
    }
    
    async search(name?: string): Promise<TenantDto[]> {
        const tenants =
            !!name
                ? await this._tenantRepository.findManyByQuery({ name })
                : await this._tenantRepository.findAll();
        return tenants.map(tenant => this._mapper.map(tenant, TenantDto));
    }
}
