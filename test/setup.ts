import { cleanUpMetadata } from "inversify-express-utils";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

import app = require("../src");
import { TYPES } from "../src/domain/constants/types";
import { ITenantRepository } from "../src/domain/interfaces/repositories";
import Tenant from "../src/domain/model/tenant";
import { container } from "../src/infrastructure/utils/ioc_container";

const mongoDb = new MongoMemoryServer();

before("Setup", async () => {
    await app.startServer();
    cleanUpMetadata();

    const tenantRepository = container.get<ITenantRepository>(
        TYPES.TenantRepository
    );
    await tenantRepository.save(
        Tenant.createInstance("Default", "Default tenant")
    );
});
after("Teardown", async () => {
    await cleanupDb();
    app.appServer.close();
});
// async function setupMongoInMemoryServer() {
//     const uri = await mongoDb.getConnectionString();
//     const port = await mongoDb.getPort();
//     process.env.MONGODB_URI = uri;
//     process.env.NODE_ENV = "test";
//     process.env.PORT = port.toString();
// }

async function cleanupDb() {
    const collections = await mongoose.connection.db
        .listCollections(undefined, { nameOnly: true })
        .toArray();
    collections.forEach(async (collection: any) => {
        await mongoose.connection.db.dropCollection(collection.name);
    });
}
