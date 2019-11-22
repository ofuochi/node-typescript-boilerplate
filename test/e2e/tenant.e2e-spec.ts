import { TypegooseModule } from "nestjs-typegoose";
import * as request from "supertest";

import { HttpStatus } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";

import { headerConstants } from "../../src/auth/constants/header.constant";
import { TenantRepository } from "../../src/tenant/repository/tenant.repository";
import { TenantController } from "../../src/tenant/tenant.controller";
import { CreateTenantInput } from "../../src/tenant/tenant.dto";
import { Tenant } from "../../src/tenant/tenant.entity";
import { TenantService } from "../../src/tenant/tenant.service";
import { User, UserRole } from "../../src/user/user.entity";
import { hashPassword } from "../../src/utils/pwHash";
import { connStr, defaultTenant } from "../setup";
import { AuthService } from "../../src/auth/auth.service";
import { AuthModule } from "../../src/auth/auth.module";
import { JwtStrategy } from "src/auth/strategies/jwt.strategy";

describe("TenantController (e2e)", () => {
	let app: NestApplication;
	let adminUser: User;
	let authService: AuthService;
	let req: request.SuperTest<request.Test>;
	let jwt: string;
	const password = "admin_p@ssW0rd";
	const endpoint = "/tenant";
	beforeAll(async () => {
		const typegooseConfig = TypegooseModule.forRoot(connStr, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		});
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				AuthModule,
				typegooseConfig,
				TypegooseModule.forFeature([Tenant])
			],
			exports: [TenantService, TenantRepository],
			providers: [TenantService, TenantRepository],
			controllers: [TenantController]
		}).compile();

		app = moduleFixture.createNestApplication();
		authService = await moduleFixture.resolve<AuthService>(AuthService);

		await app.init();

		adminUser = User.createInstance({
			firstName: "Admin",
			email: "admin@email.com",
			lastName: "Admin",
			password: await hashPassword(password),
			tenant: defaultTenant.id,
			username: "admin"
		});
		adminUser.setRoles([UserRole.ADMIN]);
		await User.getModel().create(adminUser);

		const { access_token } = await authService.generateJwt(adminUser);
		jwt = access_token;
		req = request(app.getHttpServer());
	});

	const input: CreateTenantInput = {
		description: "New Tenant",
		name: "NewTenant"
	};
	it("should create new tenant if user is host admin", async () => {
		const headers = {
			[headerConstants.tenantIdKey]: defaultTenant.id,
			[headerConstants.authorizationKey]: `Bearer ${jwt}`
		};
		const { body } = await req
			.post(endpoint)
			.set(headers)
			.send(input)
			.expect(HttpStatus.CREATED);

		expect(body).toHaveProperty("name");
		expect(body).toHaveProperty("isActive");
	});
	afterAll(async () => {
		await app.close();
	});
});
