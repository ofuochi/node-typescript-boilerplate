import { TypegooseModule } from "nestjs-typegoose";
import * as request from "supertest";

import { HttpStatus } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";

import { AuthModule } from "../../src/auth/auth.module";
import { AuthService } from "../../src/auth/auth.service";
import { headerConstants } from "../../src/auth/constants/header.constant";
import { GetAllInput } from "../../src/shared/dto/GetAll";
import { hashPassword } from "../../src/shared/utils/pwHash";
import { TenantRepository } from "../../src/tenant/repository/tenant.repository";
import { TenantController } from "../../src/tenant/tenant.controller";
import { CreateTenantInput, TenantDto } from "../../src/tenant/tenant.dto";
import { Tenant } from "../../src/tenant/tenant.entity";
import { TenantService } from "../../src/tenant/tenant.service";
import { User, UserRole } from "../../src/user/user.entity";
import { connStr, defaultTenant } from "../setup";
import { plainToClass } from "class-transformer";
import { AppModule } from "../../src/app.module";

describe("TenantController (e2e)", () => {
	let app: NestApplication;
	let user: User;
	let authService: AuthService;
	let tenantRepository: TenantRepository;
	let req: request.SuperTest<request.Test>;
	let adminJwt: string;
	const password = "admin_p@ssW0rd";
	const endpoint = "/tenants";
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
				AppModule,
				typegooseConfig,
				TypegooseModule.forFeature([Tenant])
			],
			providers: [TenantService, TenantRepository],
			controllers: [TenantController]
		}).compile();

		app = moduleFixture.createNestApplication();
		authService = await moduleFixture.resolve<AuthService>(AuthService);
		tenantRepository = await moduleFixture.resolve<TenantRepository>(
			TenantRepository
		);

		await app.init();

		user = User.createInstance({
			firstName: "Admin",
			email: "admin@email.com",
			lastName: "Admin",
			password: await hashPassword(password),
			username: "admin"
		});
		user.setRoles(UserRole.HOST);
		user = await User.getModel().create(user);

		const { access_token } = await authService.generateJwt(user);
		adminJwt = access_token;

		req = request(app.getHttpServer());
	});

	const createTenantInput: CreateTenantInput = {
		description: "New Tenant",
		name: "NewTenant"
	};
	let createdTenant: TenantDto;
	let headers: object;
	it("should create new tenant if user is host admin", async () => {
		headers = {
			[headerConstants.tenantIdKey]: defaultTenant.id,
			[headerConstants.authorizationKey]: `Bearer ${adminJwt}`
		};
		const { body } = await req
			.post(endpoint)
			.set(headers)
			.send(createTenantInput)
			.expect(HttpStatus.CREATED);

		expect(body).toHaveProperty("name");
		expect(body).toHaveProperty("isActive", true);
		createdTenant = body;
	});
	it("should return all tenant if signed-in user is an admin", async () => {
		const input: GetAllInput = { search: createTenantInput.name };
		const { body } = await req
			.get(endpoint)
			.query(input)
			.set(headers)
			.expect(HttpStatus.OK);

		const { totalCount, items } = body;

		expect(items.length).toBe(1);
		expect(totalCount).toBeGreaterThan(1);
		expect(items).toContainEqual(createdTenant);
	});

	it("should update a tenant if signed-in user is admin", async () => {
		const tenantUpdateInput: TenantDto = {
			id: createdTenant.id,
			name: "Updated"
		};
		await req
			.put(endpoint)
			.set(headers)
			.send(tenantUpdateInput)
			.expect(HttpStatus.NO_CONTENT);

		const tenantRecord = await Tenant.getModel().findById(tenantUpdateInput.id);

		expect(tenantUpdateInput.name.toUpperCase()).toEqual(tenantRecord.name);
		expect(tenantRecord.updatedBy.toString()).toEqual(user.id.toString());

		createdTenant = plainToClass(TenantDto, tenantRecord, {
			enableImplicitConversion: true,
			excludeExtraneousValues: true
		});
	});
	it("should return unauthorized request if jwt token is not set for tenant creation", async () => {
		await req
			.post(endpoint)
			.send(createTenantInput)
			.expect(HttpStatus.UNAUTHORIZED);
	});
	it("should return forbidden for non Host admin user that attempts to create tenant", async () => {
		user.setRoles(UserRole.ADMIN);

		const { access_token } = await authService.generateJwt(user);
		headers[headerConstants.authorizationKey] = `Bearer ${access_token}`;

		await req
			.post(endpoint)
			.set(headers)
			.send(createTenantInput)
			.expect(HttpStatus.FORBIDDEN);
	});
	it("should return tenant object when queried by tenant name", async () => {
		const { body } = await req
			.get(`${endpoint}/${createdTenant.name}`)
			.expect(HttpStatus.OK);

		expect(body).toHaveProperty("id", createdTenant.id);
		expect(body).toHaveProperty("name", createdTenant.name);
		expect(body).toHaveProperty("isActive", createdTenant.isActive);
		expect(body).toHaveProperty("description", createdTenant.description);
	});
	it("should soft delete tenant by host admin", async () => {
		headers[headerConstants.authorizationKey] = `Bearer ${adminJwt}`;

		await req
			.delete(`${endpoint}/${createdTenant.id}`)
			.set(headers)
			.expect(HttpStatus.NO_CONTENT);

		const {
			deletedBy,
			deletedAt,
			createdAt
		} = await Tenant.getModel().findById(createdTenant.id);
		const tenantRecord = await tenantRepository.findById(createdTenant.id);

		expect(tenantRecord).toBeUndefined();
		expect(deletedAt.getTime()).toBeGreaterThan(createdAt.getTime());
		expect(deletedBy.toString()).toEqual(user.id.toString());
	});
	it("should return not found while trying to get a deleted tenant", async () => {
		await req
			.get(`${endpoint}/${createdTenant.name}`)
			.expect(HttpStatus.NOT_FOUND);
	});
	it("should return forbidden while trying to perform an action that's only permitted by Host Admin", async () => {
		user.setRoles(UserRole.ADMIN);
		const { access_token } = await authService.generateJwt(user);

		headers[headerConstants.authorizationKey] = `Bearer ${access_token}`;
		await req
			.delete(`${endpoint}/${createdTenant.id}`)
			.set(headers)
			.expect(HttpStatus.FORBIDDEN);
	});
	afterAll(async () => {
		await app.close();
	});
});
