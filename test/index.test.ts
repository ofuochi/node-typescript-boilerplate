import { expect } from "chai";
import supertest from "supertest";
// import { cleanUpMetadata } from "inversify-express-utils";

import { startServer } from "../src/index";
import { Server } from "http";

let req: supertest.SuperTest<supertest.Test>;
let server: Server;

describe("Integration Tests:", () => {
    beforeEach(async () => {
        //   cleanUpMetadata();
        server = await startServer();
        req = supertest(server);
    });
    afterEach(async () => {
        await server.close();
    });
    it("should return list of actors", async () => {
        const res = await req.get("/api/actors").expect(200);
        expect(res.body).to.be.an("array");
    });
    it("should return list of movies", async () => {
        const res = await req.get("/api/movies").expect(200);
        expect(res.body).to.be.an("array");
    });
});
