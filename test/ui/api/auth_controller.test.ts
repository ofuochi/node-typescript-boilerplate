import httpStatus from 'http-status-codes'
import supertest from 'supertest'
import { expect } from 'chai'

import Tenant from '../../../src/domain/model/tenant'
import config from '../../../src/infrastructure/config'
import { ITenantRepository } from '../../../src/domain/interfaces/repositories'
import { container } from '../../../src/infrastructure/utils/ioc_container'
import { UserDto, UserSignInInput, UserSignUpInput } from '../../../src/ui/models/user_dto'
import { TYPES } from './../../../src/domain/constants/types'

import app = require("../../../src");
const endpoint = `${config.api.prefix}/auth`;
const tenantHeaderProp = "x-tenant-id";

describe("Auth controller", () => {
    let req: supertest.SuperTest<supertest.Test>;
    let tenantRepository: ITenantRepository;
    let tenant: Tenant;

    before(async () => {
        req = supertest(app.appServer);
        tenantRepository = container.get<ITenantRepository>(
            TYPES.TenantRepository
        );
        tenant = await tenantRepository.findOneByQuery({
            name: "Default"
        });
    });
    let signUpInput: UserSignUpInput;
    let signInInput: UserSignInInput;
    let userDto: UserDto;

    describe("User sign-up", () => {
        signUpInput = {
            username: "john",
            firstName: "Doe",
            lastName: "Doe",
            email: "john@email.com",
            password: "valid_P@ssW1d"
        };
        it("should sign-up a new user and return token and user DTO", async () => {
            const res = await req
                .post(`${endpoint}/signUp`)
                .set(tenantHeaderProp, tenant.id)
                .send(signUpInput)
                .expect(httpStatus.OK);
            expect(res.body).to.contain.keys("userDto", "token");
            userDto = res.body.user;
            signInInput = {
                emailOrUsername: signUpInput.email,
                password: signUpInput.password
            };
        });
        it("should return conflict if email already exists", async () => {
            const input = { ...signUpInput };
            input.username = `${input.username}1`;
            await req
                .post(`${endpoint}/signUp`)
                .set(tenantHeaderProp, tenant.id)
                .send(signUpInput)
                .expect(httpStatus.CONFLICT);
        });
        it("should return conflict if username already exists", async () => {
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

    describe("User sign-in", () => {
        it("should sign user in with email and return token", async () => {
            signInInput.emailOrUsername = signUpInput.email;
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
