import { plainToClass } from "class-transformer";
import { ITenantRepository } from "../../domain/interfaces/repositories";
import { Tenant } from "../../domain/model/tenant";
import { provideSingleton, inject } from "../../infrastructure/config/ioc";
import { ITenantService } from "../interfaces/tenant_service";
import { TenantDto } from "../models/tenant_dto";
import { TenantRepository } from "../../infrastructure/db/repositories/tenant_repository";

@provideSingleton(TenantService)
export class TenantService implements ITenantService {
    @inject(TenantRepository) public _tenantRepository: ITenantRepository;

    async create(name: string, description: string): Promise<TenantDto> {
        const tenant = await this._tenantRepository.insertOrUpdate(
            Tenant.createInstance(name, description)
        );
        return plainToClass(TenantDto, tenant, {
            excludeExtraneousValues: true
        });
    }

    async get(name: string): Promise<TenantDto | undefined> {
        const tenant = await this._tenantRepository.findOneByQuery({ name });
        const tenantDto =
            tenant &&
            plainToClass(TenantDto, tenant, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true
            });
        return tenantDto;
    }
    async delete(id: string): Promise<boolean> {
        return this._tenantRepository.deleteById(id);
    }
    async search(): Promise<TenantDto[]> {
        const tenants = await this._tenantRepository.findAll();

        const tenantDto = plainToClass(TenantDto, tenants, {
            enableImplicitConversion: true,
            excludeExtraneousValues: true
        });
        return tenantDto;
    }
}
