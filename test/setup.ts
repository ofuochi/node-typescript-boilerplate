import { Server } from "http";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import supertest from "supertest";

import { bootstrap } from "../src/infrastructure/bootstrapping";
import { referenceDataIoCModule } from "../src/infrastructure/config/inversify.config";
import { container } from "../src/infrastructure/utils/ioc_container";
import { startAppServer } from "../src/infrastructure/utils/server_utils";

let server: Server; // eslint-disable-line
// eslint-disable-next-line
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
});

export async function cleanupDb() {
    const collections = await mongoose.connection.db
        .listCollections(undefined, { nameOnly: true })
        .toArray();
    collections.forEach(async (collection: any) => {
        await mongoose.connection.db.dropCollection(collection.name);
    });
}
after("Teardown", async () => {
    if (server) server.close();
    await cleanupDb();
    if (mongoServer) await mongoServer.stop();
});

export { req, server };
