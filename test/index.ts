import { Server } from "http";
import { cleanUpMetadata } from "inversify-express-utils";
import supertest from "supertest";

import { startServer } from "../src";
import config from "../src/infrastructure/config";

export { config };
export let req: supertest.SuperTest<supertest.Test>;
let server: Server;

before(async () => {
    server = await startServer();
    cleanUpMetadata();
    req = supertest(server);
});

after("Teardown", async () => {
    await server.close();
});
