import { expect } from "chai";
import httpStatus from "http-status-codes";

import { req, config, tenant } from "../..";

const endpoint = `${config.api.prefix}/tenants`;

describe("Integration Tests:", () => {
    it("should return list of tenants", async () => {
        const res = await req.get(endpoint).expect(httpStatus.OK);
        expect(res.body).to.be.an("array");
    });
    it("should return tenant object when queried by tenant name", async () => {
        const res = await req
            .get(endpoint)
            .query({ name: tenant.name })
            .expect(httpStatus.OK);
        expect(res.body).to.contain.keys("isActive", "id", "name");
    });
});
