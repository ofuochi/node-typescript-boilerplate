import bcrypt from "bcrypt";
import { expect } from "chai";
import httpStatus from "http-status-codes";
import {
    ITenantRepository,
    IUserRepository
} from "../../../src/domain/data/repositories";
import { Tenant } from "../../../src/domain/model/tenant";
import { User, UserRole } from "../../../src/domain/model/user";
import { config } from "../../../src/infrastructure/config";
import { iocContainer } from "../../../src/infrastructure/config/ioc";
import { TenantRepository } from "../../../src/infrastructure/db/repositories/tenant_repository";
import { UserRepository } from "../../../src/infrastructure/db/repositories/user_repository";
import {
    X_AUTH_TOKEN_KEY,
    X_TENANT_ID
} from "../../../src/ui/constants/header_constants";
import {
    UserDto,
    UserSignUpInput,
    UserSignInInput,
    UserUpdateInput
} from "../../../src/ui/models/user_dto";
import { cleanupDb, req } from "../../setup";

describe("User controller", () => {
    let adminJwt: string;
    let tenant: Tenant;
    let userSignUpInput: UserSignUpInput;
    let userRepository: IUserRepository;
    let adminUser: User;
    const endpoint = `${config.api.prefix}/users`;
    before(async () => {
        await cleanupDb();

        userRepository = iocContainer.get<IUserRepository>(UserRepository);
        const tenantRepository = iocContainer.get<ITenantRepository>(
            TenantRepository
        );

        // Create tenant
        tenant = Tenant.createInstance("Tenant", "Tenant");
        await tenantRepository.insertOrUpdate(tenant);

        // Create an admin user

        const password = "P@ss_W0rd";
        const hashedPassword = await bcrypt.hash(password, 1);

        userSignUpInput = {
            firstName: "Admin",
            lastName: "Admin",
            username: "admin",
            email: "admin@gmail.com",
            password: hashedPassword
        };
        adminUser = User.createInstance({
            ...userSignUpInput,
            tenantId: tenant.id
        });
        adminUser.setRole(UserRole.ADMIN);
        await userRepository.insertOrUpdate(adminUser);
        const input: UserSignInInput = {
            emailOrUsername: adminUser.email,
            password
        };

        const { body } = await req
            .post(`${config.api.prefix}/auth/signin`)
            .send(input)
            .set(X_TENANT_ID, tenant.id);

        adminJwt = body.token;
    });
    describe("Admin User CRUD Operations", () => {
        let createdUser: UserDto;
        let userRecord: User;
        it("should create a new user if signed-in user is admin", async () => {
            const newUser = { ...userSignUpInput };
            newUser.email = "different_email@email.com";
            newUser.username = "different_username";
            const { body } = await req
                .post(endpoint)
                .send(newUser)
                .set(X_AUTH_TOKEN_KEY, adminJwt)
                .expect(httpStatus.OK);

            expect(body).to.contain.keys("id");

            const userRecordFromDb = await userRepository.findById(body.id);
            expect(userRecordFromDb.createdBy.toString()).to.equal(
                adminUser.id.toString()
            );

            expect(adminUser.tenant.toString()).to.equal(
                userRecordFromDb.tenant.toString()
            );

            expect(userRecordFromDb.tenant.toString()).to.equal(
                adminUser.tenant.toString()
            );
            createdUser = body;
            userRecord = userRecordFromDb;
        });
        it("should get all users if signed-in user is an admin", async () => {
            const { body } = await req
                .get(endpoint)
                .set(X_AUTH_TOKEN_KEY, adminJwt)
                .expect(httpStatus.OK);
            const { totalCount, items } = body;
            expect(items).to.be.an("array");
            expect(totalCount).to.be.greaterThan(0);
            expect(items).to.deep.include(createdUser);
        });
        it("should get a user by ID if signed-in user is an admin", async () => {
            const { body } = await req
                .get(`${endpoint}/${createdUser.id}`)
                .set(X_AUTH_TOKEN_KEY, adminJwt)
                .expect(httpStatus.OK);

            expect(body.id).to.equal(createdUser.id);
        });
        it("should return email conflict if admin user tries to create user with the same email", async () => {
            const newUser = { ...userSignUpInput };
            newUser.username += "nonConflictUsername";

            await req
                .post(endpoint)
                .send(newUser)
                .set(X_AUTH_TOKEN_KEY, adminJwt)
                .expect(httpStatus.CONFLICT);
        });
        it("should return username conflict if admin user tries to create user with the same username", async () => {
            const newUser = { ...userSignUpInput };
            newUser.email = "newMail@gmail.com";

            await req
                .post(endpoint)
                .send(newUser)
                .set(X_AUTH_TOKEN_KEY, adminJwt)
                .expect(httpStatus.CONFLICT);
        });
        it("should update a user if signed-in user is admin", async () => {
            const userUpdateInput: UserUpdateInput = {
                email: "updated@email.com"
            };
            await req
                .put(`${endpoint}/${createdUser.id}`)
                .send(userUpdateInput)
                .set(X_AUTH_TOKEN_KEY, adminJwt)
                .expect(httpStatus.NO_CONTENT);
            userRecord = await userRepository.findById(createdUser.id);
            expect(userRecord.email).to.equal(userUpdateInput.email);
            expect(userRecord.updatedBy.toString()).to.equal(
                adminUser.id.toString()
            );
            expect(userRecord.tenant.toString()).to.equal(
                adminUser.tenant.toString()
            );
            expect(userRecord.updatedAt).to.be.greaterThan(
                userRecord.createdAt
            );
        });
        it("should soft-delete a user if signed-in user is admin", async () => {
            await req
                .delete(`${endpoint}/${createdUser.id}`)
                .set(X_AUTH_TOKEN_KEY, adminJwt)
                .expect(httpStatus.NO_CONTENT);

            userRecord = await userRepository.findById(createdUser.id);
            expect(userRecord).to.be.undefined;

            userRecord = await userRepository.hardFindById(createdUser.id);
            expect(userRecord.deletedBy.toString()).to.equal(
                adminUser.id.toString()
            );
            expect(userRecord.tenant.toString()).to.equal(
                adminUser.tenant.toString()
            );
            expect(userRecord.deletionTime).to.be.ok;
        });
    });
    describe("Non-Admin Users CRUD Operations", () => {});
});
