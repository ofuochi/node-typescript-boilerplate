import { expect } from "chai";
import { req } from "../..";

describe("Integration Tests:", () => {
    it("should return list of movies", async () => {
        const res = await req.get("/api/v1/movies").expect(200);
        expect(res.body).to.be.an("array");
    });
});
