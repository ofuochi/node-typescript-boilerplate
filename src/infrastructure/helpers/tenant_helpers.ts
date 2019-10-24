import { Tenant } from "../../core/domain/models/tenant";
import { iocContainer } from "../config/ioc";
import { TenantRepository } from "../db/repositories/tenant_repository";

export async function getCurrentTenant(tenantId: string): Promise<Tenant> {
    const tenantRepository = iocContainer.get<TenantRepository>(
        TenantRepository
    );
    const tenant = await tenantRepository.findById(tenantId);
    if (!tenant) throw new Error("Tenant not found");
    return tenant;
}
