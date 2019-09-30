import httpStatus from "http-status-codes";
import supertest from "supertest";
import { expect } from "chai";

import Tenant from "../../../src/domain/model/tenant";
import config from "../../../src/infrastructure/config";
import { ITenantRepository } from "../../../src/domain/interfaces/repositories";
import { container } from "../../../src/infrastructure/utils/ioc_container";
import {
    UserDto,
    UserSignInInput,
    UserSignUpInput
} from "../../../src/ui/models/user_dto";
import { TYPES } from "./../../../src/domain/constants/types";

import app = require("../../../src");
const endpoint = `${config.api.prefix}/auth`;
const tenantHeaderProp = "x-tenant-id";

describe("Auth controller", () => {
    let req: supertest.SuperTest<supertest.Test>;
    let tenantRepository: ITenantRepository;
    let tenant: Tenant;
    let tenant1: Tenant;
    let tenant2: Tenant;
    before(async () => {
        req = supertest(app.appServer);
        tenantRepository = container.get<ITenantRepository>(
            TYPES.TenantRepository
        );

        // Get first tenant because it already exists from the setup.ts file
        tenant1 = await tenantRepository.findOneByQuery({
            name: "Default"
        });

        // Create a second tenant
        tenant2 = await tenantRepository.save(
            Tenant.createInstance("Tenant2", "Second tenant")
        );
    });

    let signUpInput: UserSignUpInput;
    describe("Sign up user", () => {
        after(() => {
            tenant = tenant1;
        });
        signUpInput = {
            username: "john",
            firstName: "Doe",
            lastName: "Doe",
            email: "john@email.com",
            password: "valid_P@ssW1d"
        };

        describe("1st tenant", () => {
            before(() => {
                tenant = tenant1;
            });
            it("should sign-up a new user and return token and user DTO", async () => {
                const res = await req
                    .post(`${endpoint}/signUp`)
                    .set(tenantHeaderProp, tenant.id)
                    .send(signUpInput)
                    .expect(httpStatus.OK);
                expect(res.body).to.contain.keys("userDto", "token");
            });

            it("should return conflict if email already exists on the same tenant", async () => {
                const input = { ...signUpInput };
                // input.username = `$1{input.username}`;
                await req
                    .post(`${endpoint}/signUp`)
                    .set(tenantHeaderProp, tenant.id)
                    .send(input)
                    .expect(httpStatus.CONFLICT);
            });
            it("should return conflict if username already exists on the same tenant", async () => {
                const input = { ...signUpInput };
                input.email = `1${input.email}`;
                await req
                    .post(`${endpoint}/signUp`)
                    .set(tenantHeaderProp, tenant.id)
                    .send(signUpInput)
                    .expect(httpStatus.CONFLICT);
            });
            it("should return bad request for invalid inputs", async () => {
                const input = { ...signUpInput };
                input.email = "invalid_email";
                input.username = `${input.username}2`;
                await req
                    .post(`${endpoint}/signUp`)
                    .set(tenantHeaderProp, tenant.id)
                    .send(input)
                    .expect(httpStatus.BAD_REQUEST);
            });
        });
        describe("2nd tenant", () => {
            before(() => {
                tenant = tenant2;
            });
            it("should sign-up a new user and return token and user DTO", async () => {
                const res = await req
                    .post(`${endpoint}/signUp`)
                    .set(tenantHeaderProp, tenant.id)
                    .send(signUpInput)
                    .expect(httpStatus.OK);
                expect(res.body).to.contain.keys("userDto", "token");
            });

            it("should return conflict if email already exists on the same tenant", async () => {
                const input = { ...signUpInput };
                input.username = `${input.username}1`;
                await req
                    .post(`${endpoint}/signUp`)
                    .set(tenantHeaderProp, tenant.id)
                    .send(signUpInput)
                    .expect(httpStatus.CONFLICT);
            });
            it("should return conflict if username already exists on the same tenant", async () => {
                const input = { ...signUpInput };
                input.email = `1${input.email}`;
                await req
                    .post(`${endpoint}/signUp`)
                    .set(tenantHeaderProp, tenant.id)
                    .send(signUpInput)
                    .expect(httpStatus.CONFLICT);
            });
            it("should return bad request for invalid inputs", async () => {
                const input = { ...signUpInput };
                input.email = "invalid_email";
                input.username = `${input.username}2`;
                await req
                    .post(`${endpoint}/signUp`)
                    .set(tenantHeaderProp, tenant.id)
                    .send(input)
                    .expect(httpStatus.BAD_REQUEST);
            });
        });
    });

    describe("User sign-in", () => {
        let signInInput: UserSignInInput = {
            password: signUpInput.password,
            emailOrUsername: signUpInput.email
        };

        it("should sign user in with email and return token", async () => {
            const res = await req
                .post(`${endpoint}/signIn`)
                .set(tenantHeaderProp, tenant.id)
                .send(signInInput)
                .expect(httpStatus.OK);
            expect(res.body).to.contain.keys("token");
        });
        it("should sign user in with username and return token", async () => {
            signInInput.emailOrUsername = signUpInput.username;
            const res = await req
                .post(`${endpoint}/signIn`)
                .set(tenantHeaderProp, tenant.id)
                .send(signInInput)
                .expect(httpStatus.OK);
            expect(res.body).to.contain.keys("token");
        });
    });
});
