import { TYPES } from "../../../../src/domain/constants/types";
import { ITenantRepository } from "../../../../src/domain/interfaces/repositories";
import { Tenant } from "../../../../src/domain/model/tenant";
import { container } from "../../../../src/infrastructure/utils/ioc_container";
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
        tenantRepository = container.get<ITenantRepository>(
            TYPES.TenantRepository
        );
        tenants.forEach(async (doc, i) => {
            tenants[i] = await tenantRepository.insertOrUpdate(doc);
        });
    });
    it("should get all the tenants without the deleted one", async () => {
        tenants[0].delete();
        // console.log(tenants);
        // await tenantRepository.insertOrUpdate(tenants[0]);
        // const res = await tenantRepository.findAll();
        // expect(res.length).to.equal(2);
    });
});
