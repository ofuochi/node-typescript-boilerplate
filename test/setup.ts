import "reflect-metadata";
import { Server } from "http";
import { cleanUpMetadata } from "inversify-express-utils";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import supertest from "supertest";
import { bootstrap } from "../src/infrastructure/bootstrapping";
import { referenceDataIoCModule } from "../src/infrastructure/config/inversify.config";
import { iocContainer } from "../src/infrastructure/config/ioc";
import { startAppServer } from "../src/infrastructure/utils/server_utils";
import { X_AUTH_TOKEN_KEY } from "../src/ui/constants/header_constants";

let server: Server; // eslint-disable-line
// eslint-disable-next-line
let req: supertest.SuperTest<supertest.Test>;
let mongoServer: MongoMemoryServer;
before("Setup", async () => {
    const mongoServer = new MongoMemoryServer();
    const connStr = await mongoServer.getConnectionString();

    const app = await bootstrap({
        iocContainer,
        connStr,
        containerModules: [referenceDataIoCModule]
    });

    server = startAppServer(app);
    req = supertest(server);
    cleanUpMetadata();
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
const tokenHeaderKey = X_AUTH_TOKEN_KEY;
export { req, server, tokenHeaderKey };
