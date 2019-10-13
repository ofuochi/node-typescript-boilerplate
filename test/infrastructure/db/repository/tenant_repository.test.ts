import { expect } from "chai";
import httpStatus from "http-status-codes";
import { TYPES } from "../../../../src/domain/constants/types";
import {
    ITenantRepository,
    IUserRepository
} from "../../../../src/domain/interfaces/repositories";
import { Tenant } from "../../../../src/domain/model/tenant";
import { UserRole } from "../../../../src/domain/model/user";
import { config } from "../../../../src/infrastructure/config";
import { iocContainer } from "../../../../src/infrastructure/config/ioc";
import { AuthController } from "../../../../src/ui/api/controllers/auth_controller";
import { IAuthService } from "../../../../src/ui/interfaces/auth_service";
import { CreateTenantDto } from "../../../../src/ui/models/tenant_dto";
import { UserDto, UserSignUpInput } from "../../../../src/ui/models/user_dto";
import { AuthService } from "../../../../src/ui/services/auth_service";
import { cleanupDb, req, tokenHeaderKey } from "../../../setup";

const endpoint = config.api.prefix;
describe("Tenant Repository", () => {
    const tenants: Tenant[] = [
        Tenant.createInstance("T0", "T0"),
        Tenant.createInstance("T1", "T1"),
        Tenant.createInstance("T2", "T2")
    ];
    let tenantRepository: ITenantRepository;
    let userDto: UserDto;
    let signUpInput: UserSignUpInput;
    let authCtrl: AuthController;
    before("Create seed tenants", async () => {
        await cleanupDb();
        const authService = iocContainer.get<IAuthService>(AuthService);
        authCtrl = new AuthController(authService);

        tenantRepository = iocContainer.get<ITenantRepository>(
            TYPES.TenantRepository
        );
        tenants.forEach(async tenant => {
            tenants[0].delete();
            await tenantRepository.insertOrUpdate(tenant);
        });

        signUpInput = {
            firstName: "Admin",
            lastName: "Admin",
            email: "admin@email.com",
            password: "P@ss_W0rd",
            username: "admin"
        };
    });
    it("should create user using the foo endpoint", async () => {
        const tenant = await tenantRepository.findOneByQuery({ name: "T2" });
        const { body } = await req
            .post(`${endpoint}/auth/signUp`)
            .send(signUpInput)
            .set("x-tenant-id", tenant.id)
            .expect(httpStatus.OK);
        userDto = body.userDto;
    });

    it("should get all the tenants but without the deleted ones", async () => {
        const res = await tenantRepository.findAll();
        expect(res.length).to.equal(2);
    });
    it("should hit the foo endpoint", async () => {
        const resp = await req
            .get(`${config.api.prefix}/foos`)
            .expect(httpStatus.OK);
        expect(resp.body).to.be.an("array");
    });

    it("should post to Foos endpoint", async () => {
        const userRepo = iocContainer.get<IUserRepository>(
            TYPES.UserRepository
        );
        const user = await userRepo.findById(userDto.id);
        user.setRole(UserRole.ADMIN);
        await userRepo.insertOrUpdate(user);

        const { token } = await authCtrl.signIn({
            emailOrUsername: signUpInput.email,
            password: signUpInput.password
        });
        const createTenantInput: CreateTenantDto = {
            name: "NewTenant",
            description: "New tenant description"
        };

        const resp = await req
            .post(`${config.api.prefix}/foos`)
            .set(tokenHeaderKey, token)
            .send(createTenantInput)
            .expect(httpStatus.OK);
        expect(resp.body).to.contain.keys(
            "id",
            "name",
            "isActive",
            "description"
        );
        expect(resp.body.id).to.be.ok;
    });
});
