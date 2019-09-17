//import { cleanUpMetadata } from "inversify-express-utils";
import { Server } from "http";
import supertest = require("supertest");
import "reflect-metadata";
import { startServer } from "../src";
import { cleanUpMetadata } from "inversify-express-utils";

let req: supertest.SuperTest<supertest.Test>;
let server: Server;
before("Set up", async () => {
    server = await startServer();
    req = supertest(server);
});
beforeEach("Clear metadata", () => {
    cleanUpMetadata();
});
after("Teardown", async () => {
    await server.close();
});

export { req };
