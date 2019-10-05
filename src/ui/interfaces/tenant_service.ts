import { TenantDto } from "../models/tenant_dto";

export interface ITenantService {
    create(name: string, description: string): Promise<TenantDto>;
    get(name: string): Promise<TenantDto | undefined>;
    search(name?: string): Promise<TenantDto[]>;
}