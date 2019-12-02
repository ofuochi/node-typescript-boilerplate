import { TypegooseModule } from "nestjs-typegoose";
import * as request from "supertest";

import { HttpStatus } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";

import { AuthModule } from "../../src/auth/auth.module";
import { AuthService } from "../../src/auth/auth.service";
import { headerConstants } from "../../src/auth/constants/header.constant";
import { TempPwResetRepository } from "../../src/db/repos/pw_reset.repo";
import { CreateGroupInput } from "../../src/group/dto/CreateGroupInput";
import { GroupDto } from "../../src/group/dto/GroupDto";
import { GroupController } from "../../src/group/group.controller";
import { Group } from "../../src/group/group.entity";
import { GroupRepository } from "../../src/group/group.repo";
import { GroupService } from "../../src/group/group.service";
import { TempToken } from "../../src/shared/entities/temp_token.entity";
import { hashPassword } from "../../src/shared/utils/pwHash";
import { User } from "../../src/user/user.entity";
import { connStr, defaultTenant } from "../setup";

describe("GroupController (e2e)", () => {
	let app: NestApplication;
	let role: Group;
	let authService: AuthService;
	let roleRepository: GroupRepository;
	let req: request.SuperTest<request.Test>;
	let adminJwt: string;
	const password = "admin_p@ssW0rd";
	const endpoint = "/groups";
	let user: User;

	beforeAll(async () => {
		const typegooseConfig = TypegooseModule.forRoot(connStr, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		});
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				TypegooseModule.forFeature([Group, TempToken]),
				typegooseConfig,
				AuthModule
			],
			exports: [GroupService, GroupRepository, TempPwResetRepository],
			providers: [GroupService, GroupRepository, TempPwResetRepository],
			controllers: [GroupController]
		}).compile();

		app = module.createNestApplication();
		authService = await module.resolve<AuthService>(AuthService);
		roleRepository = await module.resolve<GroupRepository>(GroupRepository);
		await app.init();

		user = User.createInstance({
			firstName: "Admin",
			email: "user@email.com",
			lastName: "Admin",
			password: await hashPassword(password),
			username: "user",
			tenant: defaultTenant.id
		});
		user = await User.getModel().create(user);

		const { access_token } = await authService.generateJwt(user);
		adminJwt = access_token;

		req = request(app.getHttpServer());
	});

	let headers: object;
	let createdGroup: GroupDto;
	describe("Admin User CRUD Operations", () => {
		beforeAll(
			() =>
				(headers = {
					[headerConstants.tenantIdKey]: defaultTenant.id,
					[headerConstants.authorizationKey]: `Bearer ${adminJwt}`
				})
		);
		it("should create a new role", async () => {
			const createGroupInput: CreateGroupInput = {
				name: "Grp1",
				size: 57,
				goal: "The goals",
				expiresAt: new Date(),
				isPublic: true
			};
			const { body } = await req
				.post(endpoint)
				.set(headers)
				.send(createGroupInput)
				.expect(HttpStatus.CREATED);

			const roleRecFromDb = await Group.getModel().findById(body.id);

			expect(body).toHaveProperty("id");
			expect(roleRecFromDb.createdBy.toString()).toEqual(user.id.toString());

			expect(user.tenant.toString()).toEqual(roleRecFromDb.tenant.toString());

			expect(roleRecFromDb.tenant.toString()).toEqual(user.tenant.toString());
			createdGroup = body;
		});
	});
});
