import { expect } from "chai";
import httpStatus from "http-status-codes";

import { req, config, tenant } from "../..";
import { SignUpInput } from "../../../src/ui/models/user_dto";

const endpoint = `${config.api.prefix}/auth`;

describe("Auth controller", () => {
    let signUpInput: SignUpInput;
    it("should register new user and return token and user DTO", async () => {
        signUpInput = {
            username: "valid_username",
            firstName: "valid_firstName",
            lastName: "valid_lastName",
            email: "valid@email.com",
            password: "valid_P@ssW1d"
        };
        const res = await req
            .post(`${endpoint}/signUp`)
            .set("x-tenant-id", tenant.id)
            .send(signUpInput)
            .expect(httpStatus.OK);

        expect(res.body).to.contain.keys("token", "user");
    });
});
