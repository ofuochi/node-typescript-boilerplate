import { TenantDto } from "../models/tenant_dto";
import { Tenant } from "../../domain/model/tenant";

export interface ITenantService {
    update(tenant: Partial<Tenant>): Promise<void>;
    create(name: string, description: string): Promise<TenantDto>;
    get(name: string): Promise<TenantDto | undefined>;
    getAll(): Promise<TenantDto[]>;
    delete(id: string): Promise<boolean>;
    search(): Promise<TenantDto[]>;
}
