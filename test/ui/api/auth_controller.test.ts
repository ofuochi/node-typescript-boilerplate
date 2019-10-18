import { expect } from "chai";
import httpStatus from "http-status-codes";
import {
    ITenantRepository,
    IUserRepository
} from "../../../src/domain/interfaces/repositories";
import { Tenant } from "../../../src/domain/model/tenant";
import { config } from "../../../src/infrastructure/config";
import { iocContainer } from "../../../src/infrastructure/config/ioc";
import { TenantRepository } from "../../../src/infrastructure/db/repositories/tenant_repository";
import { UserRepository } from "../../../src/infrastructure/db/repositories/user_repository";
import { X_TENANT_ID } from "../../../src/ui/constants/header_constants";
import {
    UserSignInInput,
    UserSignUpDto,
    UserSignUpInput
} from "../../../src/ui/models/user_dto";
import { cleanupDb, req } from "../../setup";

const endpoint = `${config.api.prefix}/auth`;

describe("AuthController", () => {
    let tenantRepository: ITenantRepository;
    let tenant: Tenant;
    let tenant1: Tenant;
    let tenant2: Tenant;
    before(async () => {
        await cleanupDb();

        tenantRepository = iocContainer.get<ITenantRepository>(
            TenantRepository
        );
        // Get first tenant because it already exists from the setup.ts file
        tenant1 = await tenantRepository.insertOrUpdate(
            Tenant.createInstance("Tenant1", "Second tenant")
        );

        // Create a second tenant
        tenant2 = await tenantRepository.insertOrUpdate(
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
            firstName: "John",
            lastName: "Doe",
            email: "john@email.com",
            password: "valid_P@ssW1d"
        };
        it("should sign-up a new user and return token and user DTO. Creator should be the signed up user", async () => {
            const res = await req
                .post(`${endpoint}/signUp`)
                .set(X_TENANT_ID, tenant.id)
                .send(signUpInput)
                .expect(httpStatus.OK);

            const userRepository = iocContainer.get<IUserRepository>(
                UserRepository
            );
            const { userDto, token } = res.body as UserSignUpDto;
            expect(userDto).to.contain.keys("id");
            expect(token).to.be.ok;
            const userRecord = await userRepository.findById(userDto.id);

            expect(userDto.id).to.equal(userRecord.createdBy.toString());
        });

        it("should return conflict if email already exists on the same tenant", async () => {
            const input = { ...signUpInput };
            input.username = `1${input.username}`;
            await req
                .post(`${endpoint}/signUp`)
                .set(X_TENANT_ID, tenant.id)
                .send(input)
                .expect(httpStatus.CONFLICT);
        });
        it("should return conflict if username already exists on the same tenant", async () => {
            const input = { ...signUpInput };
            input.email = `1${input.email}`;
            await req
                .post(`${endpoint}/signUp`)
                .set(X_TENANT_ID, tenant.id)
                .send(signUpInput)
                .expect(httpStatus.CONFLICT);
        });
        it("should return bad request for invalid inputs", async () => {
            const input = { ...signUpInput };
            input.email = "invalid_email";
            input.username = `${input.username}2`;
            await req
                .post(`${endpoint}/signUp`)
                .set(X_TENANT_ID, tenant.id)
                .send(input)
                .expect(httpStatus.BAD_REQUEST);
        });
        it("should return bad request for invalid tenant id", async () => {
            const input = { ...signUpInput };

            input.username = `${input.username}2`;
            await req
                .post(`${endpoint}/signUp`)
                .set(X_TENANT_ID, "invalid_tenatId")
                .send(input)
                .expect(httpStatus.BAD_REQUEST);
        });
        it("should successfully sign-up a new user on a different tenant with the same details as another tenant", async () => {
            tenant = tenant2;
            const res = await req
                .post(`${endpoint}/signUp`)
                .set(X_TENANT_ID, tenant.id)
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
                .set(X_TENANT_ID, tenant.id)
                .send(signInInput)
                .expect(httpStatus.OK);
            expect(res.body).to.contain.keys("token");
        });
        it("should sign user in with username and return token", async () => {
            signInInput.emailOrUsername = signUpInput.username;
            const res = await req
                .post(`${endpoint}/signIn`)
                .set(X_TENANT_ID, tenant.id)
                .send(signInInput)
                .expect(httpStatus.OK);
            expect(res.body).to.contain.keys("token");
        });
        it("should sign user with a another tenantId with username and return token", async () => {
            tenant = tenant2;
            signInInput.emailOrUsername = signUpInput.username;
            const res = await req
                .post(`${endpoint}/signIn`)
                .set(X_TENANT_ID, tenant.id)
                .send(signInInput)
                .expect(httpStatus.OK);
            expect(res.body).to.contain.keys("token");
        });
        it("should sign user with a another tenantId with email and return token", async () => {
            tenant = tenant2;
            signInInput.emailOrUsername = signUpInput.email;
            const res = await req
                .post(`${endpoint}/signIn`)
                .set(X_TENANT_ID, tenant.id)
                .send(signInInput)
                .expect(httpStatus.OK);
            expect(res.body).to.contain.keys("token");
        });
    });
});
