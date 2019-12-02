import { TypegooseModule } from "nestjs-typegoose";
import * as request from "supertest";

import { HttpStatus } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";

import { AuthModule } from "../../src/auth/auth.module";
import { AuthService } from "../../src/auth/auth.service";
import { headerConstants } from "../../src/auth/constants/header.constant";
import { TempPwResetRepository } from "../../src/db/repos/pw_reset.repo";
import { CreateRoleInput } from "../../src/role/dto/CreateRoleInput";
import { RoleDto } from "../../src/role/dto/RoleDto";
import { RoleController } from "../../src/role/role.controller";
import { Role } from "../../src/role/role.entity";
import { RoleRepository } from "../../src/role/role.repo";
import { RoleService } from "../../src/role/role.service";
import { TempToken } from "../../src/shared/entities/temp_token.entity";
import { hashPassword } from "../../src/shared/utils/pwHash";
import { User, UserRole } from "../../src/user/user.entity";
import { connStr, defaultTenant } from "../../test/setup";

describe("RoleController (e2e)", () => {
	let app: NestApplication;
	let role: Role;
	let authService: AuthService;
	let roleRepository: RoleRepository;
	let req: request.SuperTest<request.Test>;
	let adminJwt: string;
	const password = "admin_p@ssW0rd";
	const endpoint = "/roles";
	let adminUser: User;

	beforeAll(async () => {
		const typegooseConfig = TypegooseModule.forRoot(connStr, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		});
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				TypegooseModule.forFeature([Role, TempToken]),
				typegooseConfig,
				AuthModule
			],
			exports: [RoleService, RoleRepository, TempPwResetRepository],
			providers: [RoleService, RoleRepository, TempPwResetRepository],
			controllers: [RoleController]
		}).compile();

		app = module.createNestApplication();
		authService = await module.resolve<AuthService>(AuthService);
		roleRepository = await module.resolve<RoleRepository>(RoleRepository);
		await app.init();

		adminUser = User.createInstance({
			firstName: "Admin",
			email: "admin@email.com",
			lastName: "Admin",
			password: await hashPassword(password),
			username: "admin",
			tenant: defaultTenant.id
		});
		adminUser.setRoles(UserRole.ADMIN, UserRole.HOST);
		adminUser = await User.getModel().create(adminUser);

		const { access_token } = await authService.generateJwt(adminUser);
		adminJwt = access_token;

		req = request(app.getHttpServer());
	});

	let headers: object;
	let createdRole: RoleDto;
	describe("Admin User CRUD Operations", () => {
		beforeAll(
			() =>
				(headers = {
					[headerConstants.tenantIdKey]: defaultTenant.id,
					[headerConstants.authorizationKey]: `Bearer ${adminJwt}`
				})
		);
		it("should create a new role", async () => {
			const createRoleInput: CreateRoleInput = {
				name: "RoleName",
				description: "Role description"
			};
			const { body } = await req
				.post(endpoint)
				.set(headers)
				.send(createRoleInput)
				.expect(HttpStatus.CREATED);

			const roleRecFromDb = await Role.getModel().findById(body.id);

			expect(body).toHaveProperty("id");
			expect(roleRecFromDb.createdBy.toString()).toEqual(
				adminUser.id.toString()
			);

			expect(adminUser.tenant.toString()).toEqual(
				roleRecFromDb.tenant.toString()
			);

			expect(roleRecFromDb.tenant.toString()).toEqual(
				adminUser.tenant.toString()
			);
			createdRole = body;
		});
	});
});
