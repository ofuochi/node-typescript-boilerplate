import { expect } from "chai";
import { TYPES } from "../../../../src/domain/constants/types";
import { ITenantRepository } from "../../../../src/domain/interfaces/repositories";
import { Tenant } from "../../../../src/domain/model/tenant";
import { iocContainer } from "../../../../src/infrastructure/config/ioc";
import { cleanupDb } from "../../../setup";

describe("Tenant Repository", () => {
    const tenants: Tenant[] = [
        Tenant.createInstance("T0", "T0"),
        Tenant.createInstance("T1", "T1"),
        Tenant.createInstance("T2", "T2")
    ];
    let tenantRepository: ITenantRepository;
    before("Create seed tenants", async () => {
        await cleanupDb();

        tenantRepository = iocContainer.get<ITenantRepository>(
            TYPES.TenantRepository
        );
        tenants.forEach(async tenant => {
            tenants[0].delete();
            await tenantRepository.insertOrUpdate(tenant);
        });
    });

    it("should get all the tenants but without the deleted ones", async () => {
        const res = await tenantRepository.findAll();
        expect(res.length).to.equal(2);
    });
});
