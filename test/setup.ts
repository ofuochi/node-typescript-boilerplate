import { Server } from "http";
import { cleanUpMetadata } from "inversify-express-utils";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import supertest from "supertest";

import { TYPES } from "../src/domain/constants/types";
import { ITenantRepository } from "../src/domain/interfaces/repositories";
import Tenant from "../src/domain/model/tenant";
import { bootstrap } from "../src/infrastructure/bootstrapping";
import { referenceDataIoCModule } from "../src/infrastructure/config/inversify.config";
import { container } from "../src/infrastructure/utils/ioc_container";
import { startAppServer } from "../src/infrastructure/utils/server_utils";

let server: Server;
let req: supertest.SuperTest<supertest.Test>;
let mongoServer: MongoMemoryServer;
before("Setup", async () => {
    const mongoServer = new MongoMemoryServer();
    const connStr = await mongoServer.getConnectionString();

    const app = await bootstrap({
        container,
        connStr,
        containerModules: [referenceDataIoCModule]
    });

    server = startAppServer(app);
    req = supertest(server);
    cleanUpMetadata();

    const tenantRepository = container.get<ITenantRepository>(
        TYPES.TenantRepository
    );
    const tenant = await tenantRepository.findOneByQuery({
        name: "Default"
    });
    if (!tenant)
        await tenantRepository.save(
            Tenant.createInstance("Default", "Default tenant")
        );
});
after("Teardown", async () => {
    if (server) server.close();
    await cleanupDb();
    if (mongoServer) await mongoServer.stop();
});

async function cleanupDb() {
    const collections = await mongoose.connection.db
        .listCollections(undefined, { nameOnly: true })
        .toArray();
    collections.forEach(async (collection: any) => {
        await mongoose.connection.db.dropCollection(collection.name);
    });
}
export { req };
