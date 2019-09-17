//import { cleanUpMetadata } from "inversify-express-utils";
import { Server } from "http";
import { cleanUpMetadata } from "inversify-express-utils";
import supertest = require("supertest");
import { startServer } from "../src";

let req: supertest.SuperTest<supertest.Test>;
let server: Server;
before("Set up", async () => {
    server = await startServer();
    req = supertest(server);
});
beforeEach(() => {
    cleanUpMetadata();
});
after("Teardown", async () => {
    await server.close();
});

export { req };
