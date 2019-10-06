import bcrypt from "bcrypt";
import { expect } from "chai";
import httpStatus from "http-status-codes";

import { TYPES } from "../../../src/domain/constants/types";
import {
    ITenantRepository,
    IUserRepository
} from "../../../src/domain/interfaces/repositories";
import Tenant from "../../../src/domain/model/tenant";
import { User, UserRole } from "../../../src/domain/model/user";
import config from "../../../src/infrastructure/config";
import container from "../../../src/infrastructure/utils/ioc_container";
import { IAuthService } from "../../../src/ui/interfaces/auth_service";
import { CreateTenantInput } from "../../../src/ui/models/tenant_dto";
import { req } from "../../setup";

const endpoint = `${config.api.prefix}/tenants`;
let authService: IAuthService;
let userRepository: IUserRepository;
let tenantRepository: ITenantRepository;

describe("Tenant controller", async () => {
    const password = "dadf_jad63A";
    let user: User;
    let jwtToken: string;
    let tenant: Tenant;

    before(async () => {
        userRepository = container.get<IUserRepository>(TYPES.UserRepository);
        authService = container.get<IAuthService>(TYPES.AuthService);
        tenantRepository = container.get<ITenantRepository>(
            TYPES.TenantRepository
        );
        tenant = await tenantRepository.findOneByQuery({ name: "Default" });
        const hashedPw = await bcrypt.hash(password, 1);
        user = User.createInstance({
            firstName: "Admin",
            lastName: "Admin",
            email: "admin@gmail.com",
            password: hashedPw,
            username: "admin"
        });
        user.setRole(UserRole.ADMIN);
        const result = (await userRepository.save(user)) as User;
        user.id = result.id;

        const { token } = await authService.signIn({
            password,
            emailOrUsername: user.username
        });
        jwtToken = token;
    });
    const createTenantInput: CreateTenantInput = {
        name: "NewTenant",
        description: "New tenant"
    };
    const authTokenHeader = "X-Auth-Token";
    it("should create new tenant and return tenant DTO object if user is an admin", async () => {
        const res = await req
            .post(endpoint)
            .set(authTokenHeader, jwtToken)
            .send(createTenantInput)
            .expect(httpStatus.OK);

        expect(res.body).to.contain.keys("name", "id", "description");
    });
    it("should return bad request if jwt token is not set", async () => {
        await req
            .post(endpoint)
            .send(createTenantInput)
            .expect(httpStatus.BAD_REQUEST);
    });
    it("should return forbidden for non admin user that attempts to create tenant", async () => {
        user.setRole(UserRole.USER);
        await userRepository.save(user);
        const { token } = await authService.signIn({
            password,
            emailOrUsername: user.username
        });

        await req
            .post(endpoint)
            .set(authTokenHeader, token)
            .send(createTenantInput)
            .expect(httpStatus.FORBIDDEN);
    });

    it("should return list of tenants", async () => {
        const res = await req.get(endpoint).expect(httpStatus.OK);
        expect(res.body).to.be.an("array");
    });
    it("should return tenant object when queried by tenant name", async () => {
        const res = await req
            .get(endpoint)
            .query({ name: tenant.name })
            .expect(httpStatus.OK);
        expect(res.body[0]).to.contain.keys("isActive", "id", "name");
    });
});
