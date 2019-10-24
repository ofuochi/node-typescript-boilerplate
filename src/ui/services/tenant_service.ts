import httpStatus from "http-status-codes";
import { plainToClass } from "class-transformer";
import { ITenantRepository } from "../../core/domain/data/repositories";
import { Tenant } from "../../core/domain/models/tenant";
import { provideSingleton, inject } from "../../infrastructure/config/ioc";
import { ITenantService } from "../../core/domain/services/tenant_service";
import { TenantDto } from "../models/tenant_dto";
import { TenantRepository } from "../../infrastructure/db/repositories/tenant_repository";
import { HttpError } from "../error";

@provideSingleton(TenantService)
export class TenantService implements ITenantService {
    @inject(TenantRepository) public _tenantRepository: ITenantRepository;

    async create(name: string, description: string): Promise<TenantDto> {
        const tenant = await this._tenantRepository.insertOrUpdate(
            Tenant.createInstance(name, description)
        );
        return plainToClass(TenantDto, tenant, {
            enableImplicitConversion: true,
            excludeExtraneousValues: true
        });
    }
    async update(tenant: Partial<Tenant>): Promise<void> {
        const tenantToUpdate = await this._tenantRepository.findById(tenant.id);
        if (!tenantToUpdate)
            throw new HttpError(
                httpStatus.NOT_FOUND,
                `Tenant with ID "${tenant.id}" does not exist`
            );

        // check that tenantToUpdate does not overwrite an existing tenant name

        tenantToUpdate.update(tenant);
        await this._tenantRepository.insertOrUpdate(tenantToUpdate);
    }
    async pagedGetAll({
        searchStr,
        skip,
        limit
    }: {
        searchStr?: string;
        skip: number;
        limit: number;
    }): Promise<{ totalCount: number; items: Tenant[] }> {
        return this._tenantRepository.pagedFindAll({
            searchStr,
            skip,
            limit
        });
    }
    async getAll(): Promise<TenantDto[]> {
        const tenants = await this._tenantRepository.findAll();
        return plainToClass<TenantDto, Tenant>(TenantDto, tenants, {
            enableImplicitConversion: true,
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
