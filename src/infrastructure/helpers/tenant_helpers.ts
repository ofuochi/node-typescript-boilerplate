import { TYPES } from "../../domain/constants/types";
import Tenant from "../../domain/model/tenant";
import { TenantRepository } from "../db/repositories/tenant_repository";
import { container } from "../utils/ioc_container";

export const getCurrentTenant = async (tenantId: string): Promise<Tenant> => {
    const tenantRepository = container.get<TenantRepository>(
        TYPES.TenantRepository
    );

    const tenant = await tenantRepository.findById(tenantId);
    if (!tenant) throw new Error("Tenant not found");
    return tenant;
};
