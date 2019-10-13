import { AutoMapper } from "automapper-nartc";
import {
    autoMapper,
    tenantRepository
} from "../../domain/constants/decorators";
import { ITenantRepository } from "../../domain/interfaces/repositories";
import { Tenant } from "../../domain/model/tenant";
import { provideSingleton } from "../../infrastructure/config/ioc";
import { ITenantService } from "../interfaces/tenant_service";
import { TenantDto } from "../models/tenant_dto";

@provideSingleton(TenantService)
export class TenantService implements ITenantService {
    @autoMapper public _mapper: AutoMapper;
    @tenantRepository public _tenantRepository: ITenantRepository;

    async create(name: string, description: string): Promise<TenantDto> {
        const tenant = await this._tenantRepository.insertOrUpdate(
            Tenant.createInstance(name, description)
        );
        return this._mapper.map(tenant, TenantDto);
    }

    async get(name: string): Promise<TenantDto | undefined> {
        const tenant = await this._tenantRepository.findOneByQuery({ name });
        return tenant && this._mapper.map(tenant, TenantDto);
    }
    async delete(id: string): Promise<boolean> {
        return this._tenantRepository.deleteById(id);
    }
    async search(name?: string): Promise<TenantDto[]> {
        const tenants = name
            ? await this._tenantRepository.findManyByQuery({ name })
            : await this._tenantRepository.findAll();
        return this._mapper.mapArray(tenants, TenantDto);
    }
}
