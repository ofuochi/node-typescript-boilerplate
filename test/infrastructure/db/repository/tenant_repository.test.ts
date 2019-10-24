import { expect } from "chai";
import { ITenantRepository } from "../../../../src/domain/interfaces/repositories";
import { Tenant } from "../../../../src/domain/model/tenant";
import { iocContainer } from "../../../../src/infrastructure/config/ioc";
import { TenantRepository } from "../../../../src/infrastructure/db/repositories/tenant_repository";
import { cleanupDb } from "../../../setup";

describe("Tenant Repository", () => {
    const tenants: Tenant[] = [
        Tenant.createInstance("T1", "T1"),
        Tenant.createInstance("T2", "T2"),
        Tenant.createInstance("T3", "T3"),
        Tenant.createInstance("T4", "T4"),
        Tenant.createInstance("T5", "T5")
    ];
    let tenantRepository: ITenantRepository;
    before("Create seed tenants", async () => {
        await cleanupDb();

        tenantRepository = iocContainer.get<ITenantRepository>(
            TenantRepository
        );
        await tenantRepository.insertMany(tenants);
    });

    it("should get all the tenants but without the deleted ones", async () => {
        tenants[0].delete();
        await tenantRepository.insertOrUpdate(tenants[0]);
        const res = await tenantRepository.findAll();
        expect(res.length).to.equal(4);
    });
});
