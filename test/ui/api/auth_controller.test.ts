import { expect } from "chai";
import httpStatus from "http-status-codes";

import { config, req, tenant } from "../..";
import {
    SignInInput,
    SignUpInput,
    UserDto
} from "../../../src/ui/models/user_dto";

const endpoint = `${config.api.prefix}/auth`;
const tenantHeaderProp = "x-tenant-id";

describe("Auth controller", () => {
    let userDto: UserDto;
    const signUpInput: SignUpInput = {
        username: "john",
        firstName: "Doe",
        lastName: "Doe",
        email: "john@email.com",
        password: "valid_P@ssW1d"
    };
    const signInInput: SignInInput = {
        emailOrUsername: signUpInput.email,
        password: signUpInput.password
    };

    it("should register new user and return token and user DTO", async () => {
        const res = await req
            .post(`${endpoint}/signUp`)
            .set(tenantHeaderProp, tenant.id)
            .send(signUpInput)
            .expect(httpStatus.OK);

        expect(res.body).to.contain.keys("token", "user");
        userDto = res.body.user;
    });
    it("should sign user in and return token", async () => {
        const res = await req
            .post(`${endpoint}/signIn`)
            .set(tenantHeaderProp, tenant.id)
            .send(signInInput)
            .expect(httpStatus.OK);
        expect(res.body).to.contain.keys("token");
    });
});
