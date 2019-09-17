import { expect } from "chai";
import { req } from ".";

describe("Integration Tests:", () => {
    it("should return list of actors", async () => {
        const res = await req.get("/api/actors").expect(200);
        expect(res.body).to.be.an("array");
    });
    it("should return list of movies", async () => {
        const res = await req.get("/api/movies").expect(200);
        expect(res.body).to.be.an("array");
    });
});
