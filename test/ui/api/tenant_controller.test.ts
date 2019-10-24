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
import { IAuthService } from "../../../src/domain/services/auth_service";
import {
    CreateTenantInput,
    TenantDto,
    TenantUpdateInput
} from "../../../src/ui/models/tenant_dto";
import { UserSignInInput } from "../../../src/ui/models/user_dto";
import { AuthService } from "../../../src/ui/services/auth_service";
import { cleanupDb, req } from "../../setup";

const endpoint = `${config.api.prefix}/tenants`;
let authService: IAuthService;
let userRepository: IUserRepository;
let tenantRepository: ITenantRepository;

async function signIn(
    tenantId: string,
    signInInput: UserSignInInput
): Promise<{ token: string }> {
    const res = await req
        .post(`${config.api.prefix}/auth/signIn`)
        .set(X_TENANT_ID, tenantId)
        .send(signInInput);
    return { token: res.body.token };
}
describe("Tenant controller", async () => {
    const password = "dadf_jad63A";
    let user: User;
    let jwtToken: string;
    let tenant: Tenant;
    let signInInput: UserSignInInput;
    before(async () => {
        await cleanupDb();

        userRepository = iocContainer.get<IUserRepository>(UserRepository);
        authService = iocContainer.get<IAuthService>(AuthService);
        tenantRepository = iocContainer.get<ITenantRepository>(
            TenantRepository
        );
        tenant = await tenantRepository.insertOrUpdate(
            Tenant.createInstance("Default", "Default")
        );
        const hashedPw = await bcrypt.hash(password, 1);

        user = User.createInstance({
            firstName: "Admin",
            lastName: "Admin",
            email: "admin@gmail.com",
            password: hashedPw,
            username: "admin",
            tenantId: tenant.id
        });
        user.setRole(UserRole.ADMIN);
        await userRepository.insertOrUpdate(user);

        signInInput = {
            emailOrUsername: user.username,
            password
        };

        const { token } = await signIn(tenant.id, signInInput);

        jwtToken = token;
    });
    const createTenantInput: CreateTenantInput = {
        name: "NewTenant",
        description: "New tenant"
    };
    let createdTenant: TenantDto;
    it("should create new tenant and return tenant DTO object if user is an admin", async () => {
        const { body } = await req
            .post(endpoint)
            .set(X_AUTH_TOKEN_KEY, jwtToken)
            .send(createTenantInput)
            .expect(httpStatus.OK);
        expect(body).to.contain.keys("name", "id", "description");
        createdTenant = body;
    });

    it("should return all tenant if signed-in user is an admin", async () => {
        const { body } = await req
            .get(endpoint)
            .set(X_AUTH_TOKEN_KEY, jwtToken)
            .expect(httpStatus.OK);
        const { totalCount, items } = body;

        expect(items).to.be.an("array");
        expect(totalCount).to.be.greaterThan(0);
        expect(items).to.deep.include(createdTenant);
    });
    it("should update a tenant if signed-in user is admin", async () => {
        const tenantUpdateInput: TenantUpdateInput = {
            name: "Updated"
        };
        await req
            .put(`${endpoint}/${createdTenant.id}`)
            .set(X_AUTH_TOKEN_KEY, jwtToken)
            .send(tenantUpdateInput)
            .expect(httpStatus.NO_CONTENT);

        const tenantRecord = await tenantRepository.findById(createdTenant.id);

        expect(tenantUpdateInput.name.toUpperCase()).to.equal(
            tenantRecord.name
        );
        expect(tenantRecord.updatedBy.toString()).to.equal(user.id.toString());
    });
    it("should return unauthorized request if jwt token is not set for tenant creation", async () => {
        await req
            .post(endpoint)
            .send(createTenantInput)
            .expect(httpStatus.UNAUTHORIZED);
    });
    it("should return forbidden for non admin user that attempts to create tenant", async () => {
        user.setRole(UserRole.USER);
        await userRepository.insertOrUpdate(user);
        const { token } = await signIn(tenant.id, signInInput);

        await req
            .post(endpoint)
            .set(X_AUTH_TOKEN_KEY, token)
            .send(createTenantInput)
            .expect(httpStatus.FORBIDDEN);

        expect(user.updatedBy).to.be.ok;
    });

    it("should return tenant object when queried by tenant name", async () => {
        const res = await req
            .get(`${endpoint}/${tenant.name}`)
            .expect(httpStatus.OK);
        expect(res.body).to.contain.keys("isActive", "id", "name");
    });

    it("should soft delete tenant by admin", async () => {
        user.setRole(UserRole.ADMIN);
        await userRepository.insertOrUpdate(user);

        const { token } = await authService.signIn({
            password,
            emailOrUsername: user.username
        });

        await req
            .delete(`${endpoint}/${createdTenant.id}`)
            .set(X_AUTH_TOKEN_KEY, token)
            .expect(httpStatus.NO_CONTENT);

        const tenantRecord = await tenantRepository.findById(createdTenant.id);
        const deletedTenantRecord = await tenantRepository.hardFindById(
            createdTenant.id
        );

        expect(tenantRecord).to.be.undefined;
        expect(deletedTenantRecord.deletedBy.toString()).to.equal(
            user.id.toString()
        );
        jwtToken = token;
    });
    it("should return not found while trying to update a deleted tenant", async () => {
        const tenantUpdateInput: TenantUpdateInput = {
            name: "Updated"
        };
        await req
            .put(`${endpoint}/${createdTenant.id}`)
            .set(X_AUTH_TOKEN_KEY, jwtToken)
            .send(tenantUpdateInput)
            .expect(httpStatus.NOT_FOUND);
    });
    it("should return unauthorized while trying to perform an action with an already deleted tenant header", async () => {
        tenant.delete();
        await tenantRepository.deleteById(tenant.id);
        await req
            .delete(`${endpoint}/${tenant.id}`)
            .set(X_AUTH_TOKEN_KEY, jwtToken)
            .expect(httpStatus.UNAUTHORIZED);
    });
});
