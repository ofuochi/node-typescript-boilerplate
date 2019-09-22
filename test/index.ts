import { Server } from "http";
import { cleanUpMetadata } from "inversify-express-utils";
import supertest from "supertest";
import mongoose from "mongoose";

import { startServer } from "../src";
import { TYPES } from "../src/domain/constants/types";
import { ITenantRepository } from "../src/domain/interfaces/repositories";
import Tenant from "../src/domain/model/tenant";
import config from "../src/infrastructure/config";
import { container } from "../src/infrastructure/utils/ioc_container";

export { config };
export let req: supertest.SuperTest<supertest.Test>;
export let tenant: Tenant;
let server: Server;

before("Startup", async () => {
    server = await startServer();
    cleanUpMetadata();
    req = supertest(server);
    const tenantRepository = container.get<ITenantRepository>(
        TYPES.TenantRepository
    );
    tenant = await tenantRepository.save(
        Tenant.createInstance("Default", "Default tenant")
    );
});

after("Teardown", async () => {
    const collections = await mongoose.connection.db
        .listCollections(null, { nameOnly: true })
        .toArray();
    collections.forEach(async collection => {
        await mongoose.connection.db.dropCollection(collection.name);
    });
    await server.close();
});
