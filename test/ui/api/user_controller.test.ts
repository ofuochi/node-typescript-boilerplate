import bcrypt from "bcrypt";
import { expect } from "chai";
import httpStatus from "http-status-codes";
import {
    ITenantRepository,
    IUserRepository
} from "../../../src/domain/interfaces/repositories";
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
import { cleanupDb, req } from "../../setup";
import { UserSignUpInput } from "../../../src/ui/models/user_dto";

describe("User controller", () => {
    let jwt: string;
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
            email: "email@gmail.com",
            password: hashedPassword
        };
        adminUser = User.createInstance({
            ...userSignUpInput,
            tenantId: tenant.id
        });
        adminUser.setRole(UserRole.ADMIN);
        await userRepository.insertOrUpdate(adminUser);

        const { body } = await req
            .post(`${config.api.prefix}/auth/signIn`)
            .send({ emailOrUsername: userSignUpInput.email, password })
            .set(X_TENANT_ID, tenant.id);

        jwt = body.token;
    });
    describe("Admin User CRUD Operations", () => {
        it("should create a new user if signed-in user is admin", async () => {
            const newUser = { ...userSignUpInput };
            const { body } = await req
                .post(endpoint)
                .send(newUser)
                .set(X_AUTH_TOKEN_KEY, jwt)
                .expect(httpStatus.OK);

            expect(body).to.contain.keys("id");

            const user = await userRepository.findById(body.id);
            expect(user.createdBy.toString()).to.equal(adminUser.id.toString());

            expect(user.tenant.toString()).to.equal(
                adminUser.tenant.toString()
            );
        });
    });
    describe("Non-Admin Users CRUD Operations", () => {});
});
