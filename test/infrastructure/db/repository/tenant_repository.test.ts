import { expect } from "chai";
import { ITenantRepository } from "../../../../src/domain/data/repositories";
import { Tenant } from "../../../../src/domain/model/tenant";
import { iocContainer } from "../../../../src/infrastructure/config/ioc";
import { TenantRepository } from "../../../../src/infrastructure/db/repositories/tenant_repository";
import { cleanupDb } from "../../../setup";

describe("Tenant Repository", () => {
    const tenants: Tenant[] = [
        Tenant.createInstance("T0", "T0"),
        Tenant.createInstance("T1", "T1")
    ];
    let tenantRepository: ITenantRepository;
    before("Create seed tenants", async () => {
        await cleanupDb();

        tenants[0].delete();

        tenantRepository = iocContainer.get<ITenantRepository>(
            TenantRepository
        );
        tenants.forEach(async tenant => {
            await tenantRepository.insertOrUpdate(tenant);
        });
    });

    it("should get all the tenants but without the deleted ones", async () => {
        const res = await tenantRepository.findAll();
        expect(res.length).to.equal(1);
    });
});
