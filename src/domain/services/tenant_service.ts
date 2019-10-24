import { TenantDto } from "../../ui/models/tenant_dto";
import { Tenant } from "../model/tenant";
import { IBaseService } from "./base_service";

export interface ITenantService extends IBaseService<Tenant> {
    update(tenant: Partial<Tenant>): Promise<void>;
    create(name: string, description: string): Promise<TenantDto>;
    get(name: string): Promise<TenantDto | undefined>;
    getAll(): Promise<TenantDto[]>;
    delete(id: string): Promise<boolean>;
    search(): Promise<TenantDto[]>;
}
