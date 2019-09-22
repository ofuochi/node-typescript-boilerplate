import { expect } from "chai";
import httpStatus from "http-status-codes";

import { req, config, tenant } from "../..";

const endpoint = `${config.api.prefix}/tenants`;

describe("Integration Tests:", () => {
    it("should return list of tenants", async () => {
        const res = await req
            .get(endpoint)
            .set("x-tenant-id", tenant.id)
            .expect(httpStatus.OK);
        expect(res.body).to.be.an("array");
    });
});
