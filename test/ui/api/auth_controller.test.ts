import { expect } from "chai";
import httpStatus from "http-status-codes";
import { Test } from "supertest";
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
    UserSignUpInput,
    UserSignUpDto
} from "../../../src/ui/models/user_dto";
import { cleanupDb, req } from "../../setup";

const endpoint = `${config.api.prefix}/auth`;

describe("AuthController", () => {
    let tenantRepository: ITenantRepository;
    let userRepository: IUserRepository;
    let tenant: Tenant;
    let tenant1: Tenant;
    let tenant2: Tenant;

    before(async () => {
        await cleanupDb();

        tenantRepository = iocContainer.get<ITenantRepository>(
            TenantRepository
        );
        userRepository = iocContainer.get<IUserRepository>(UserRepository);

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
            if (!userDto) throw new Error("User DTO cannot be null");
            const userRecord = await userRepository.findById(userDto.id);

            expect(userDto).to.be.ok;
            expect(userDto).to.contain.keys("id");
            expect(token).to.be.ok;
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
                .set(X_TENANT_ID, "invalid_tenantId")
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
        describe("Valid User Signin", () => {
            const signInInput: UserSignInInput = {
                password: signUpInput.password,
                emailOrUsername: signUpInput.email
            };

            it("should sign-in user with email and return token", async () => {
                const res = await req
                    .post(`${endpoint}/signIn`)
                    .set(X_TENANT_ID, tenant.id)
                    .send(signInInput)
                    .expect(httpStatus.OK);
                expect(res.body).to.contain.keys("token");
            });
            it("should sign-in user with username and return token", async () => {
                signInInput.emailOrUsername = signUpInput.username;
                const res = await req
                    .post(`${endpoint}/signIn`)
                    .set(X_TENANT_ID, tenant.id)
                    .send(signInInput)
                    .expect(httpStatus.OK);
                expect(res.body).to.contain.keys("token");
            });
            it("should sign-in user that has same username on a different tenant using username and return token", async () => {
                tenant = tenant2;
                signInInput.emailOrUsername = signUpInput.username;
                const res = await req
                    .post(`${endpoint}/signIn`)
                    .set(X_TENANT_ID, tenant.id)
                    .send(signInInput)
                    .expect(httpStatus.OK);
                expect(res.body).to.contain.keys("token");
            });
            it("should sign-in user that has same email on a different tenant using email and return token", async () => {
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

        describe("Invalid User Signin", () => {
            let invalidSignInInput: UserSignInInput;
            const { maxSignInAttempts } = config.userLockout;

            beforeEach(async () => {
                const userInDb = await userRepository.findOneByQuery({});
                invalidSignInInput = {
                    emailOrUsername: userInDb.email,
                    password: "invalid_password"
                };
                userInDb.clearLockOut();
                await userRepository.insertOrUpdate(userInDb);
            });

            it("should increase user sign-in attempts by 1 when use sign-in fails due to invalid password", async () => {
                const userInitial = await userRepository.findOneByQuery({
                    tenant: tenant.id,
                    email: invalidSignInInput.emailOrUsername
                });

                await req
                    .post(`${endpoint}/signIn`)
                    .set(X_TENANT_ID, tenant.id)
                    .send(invalidSignInInput);

                const userFinal = await userRepository.findOneByQuery({
                    tenant: tenant.id,
                    email: invalidSignInInput.emailOrUsername
                });

                expect(userFinal.signInAttempts).to.be.equal(
                    userInitial.signInAttempts + 1
                );
            });
            it("should lockout user immediately after making the maximum allowed consecutive sign-in attempts", async () => {
                const signIns: Test[] = [];
                const array = Array.from(Array(maxSignInAttempts).keys());

                array.forEach(() => {
                    signIns.push(
                        req
                            .post(`${endpoint}/signIn`)
                            .set(X_TENANT_ID, tenant.id)
                            .send(invalidSignInInput)
                    );
                });
                await Promise.all(signIns);

                const user = await userRepository.findOneByQuery({
                    tenant: tenant.id,
                    email: invalidSignInInput.emailOrUsername
                });
                expect(user.isLockedOut).to.be.true;
            });

            it("should NOT increase sign-in attempts when user is on lockout", async () => {
                const signIns: Test[] = [];
                const array = Array.from(Array(maxSignInAttempts + 3).keys());

                array.forEach(() => {
                    signIns.push(
                        req
                            .post(`${endpoint}/signIn`)
                            .set(X_TENANT_ID, tenant.id)
                            .send(invalidSignInInput)
                    );
                });
                await Promise.all(signIns);

                const userFinal = await userRepository.findOneByQuery({
                    tenant: tenant.id,
                    email: invalidSignInInput.emailOrUsername
                });
                expect(userFinal.signInAttempts).to.be.equal(maxSignInAttempts);
            });
        });
    });
});
