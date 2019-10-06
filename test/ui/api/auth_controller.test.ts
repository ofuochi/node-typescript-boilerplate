import { expect } from "chai";
import httpStatus from "http-status-codes";

import {
    ITenantRepository,
    IUserRepository
} from "../../../src/domain/interfaces/repositories";
import { Tenant } from "../../../src/domain/model/tenant";
import { config } from "../../../src/infrastructure/config";
import { container } from "../../../src/infrastructure/utils/ioc_container";
import {
    UserSignInInput,
    UserSignUpDto,
    UserSignUpInput
} from "../../../src/ui/models/user_dto";
import { TYPES } from "../../../src/domain/constants/types";
import { req } from "../../setup";

const endpoint = `${config.api.prefix}/auth`;
const tenantHeaderProp = "x-tenant-id";

describe("Auth controller", () => {
    let tenantRepository: ITenantRepository;
    let tenant: Tenant;
    let tenant1: Tenant;
    let tenant2: Tenant;
    before(async () => {
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
        tenant = tenant1;
    });
    afterEach(() => {
        tenant = tenant1;
    });

    let signUpInput: UserSignUpInput;

    describe("Sign up user", () => {
        signUpInput = {
            username: "john",
            firstName: "Doe",
            lastName: "Doe",
            email: "john@email.com",
            password: "valid_P@ssW1d"
        };

        it("should sign-up a new user and return token and user DTO. Creator should be the signed up user", async () => {
            const res = await req
                .post(`${endpoint}/signUp`)
                .set(tenantHeaderProp, tenant.id)
                .send(signUpInput)
                .expect(httpStatus.OK);

            const userRepository = container.get<IUserRepository>(
                TYPES.UserRepository
            );
            const result = res.body as UserSignUpDto;
            expect(result).to.contain.keys("userDto", "token");

            const userRecord = await userRepository.findById(result.userDto.id);

            expect(result.userDto.id.toString()).to.equal(
                userRecord.createdBy.toString()
            );
        });

        it("should return conflict if email already exists on the same tenant", async () => {
            const input = { ...signUpInput };
            input.username = `1${input.username}`;
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
        it("should return bad request for invalid tenant id", async () => {
            const input = { ...signUpInput };

            input.username = `${input.username}2`;
            await req
                .post(`${endpoint}/signUp`)
                .set(tenantHeaderProp, "invalid_tenatId")
                .send(input)
                .expect(httpStatus.BAD_REQUEST);
        });
        it("should successfully sign-up a new user on a different tenant with the same details as another tenant", async () => {
            tenant = tenant2;
            const res = await req
                .post(`${endpoint}/signUp`)
                .set(tenantHeaderProp, tenant.id)
                .send(signUpInput)
                .expect(httpStatus.OK);
            expect(res.body).to.contain.keys("userDto", "token");
        });
    });

    describe("User sign-in", () => {
        const signInInput: UserSignInInput = {
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
        it("should sign user with a another tenantId with username and return token", async () => {
            tenant = tenant2;
            signInInput.emailOrUsername = signUpInput.username;
            const res = await req
                .post(`${endpoint}/signIn`)
                .set(tenantHeaderProp, tenant.id)
                .send(signInInput)
                .expect(httpStatus.OK);
            expect(res.body).to.contain.keys("token");
        });
        it("should sign user with a another tenantId with email and return token", async () => {
            tenant = tenant2;
            signInInput.emailOrUsername = signUpInput.email;
            const res = await req
                .post(`${endpoint}/signIn`)
                .set(tenantHeaderProp, tenant.id)
                .send(signInInput)
                .expect(httpStatus.OK);
            expect(res.body).to.contain.keys("token");
        });
    });
});
