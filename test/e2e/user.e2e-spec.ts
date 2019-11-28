import { plainToClass } from "class-transformer";
import { TypegooseModule } from "nestjs-typegoose";
import { GetAllInput } from "src/shared/dto/GetAll";
import * as request from "supertest";

import { HttpStatus } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";

import { AuthModule } from "../../src/auth/auth.module";
import { AuthService } from "../../src/auth/auth.service";
import { headerConstants } from "../../src/auth/constants/header.constant";
import { RegisterInput } from "../../src/auth/dto/RegisterInput";
import { TempPwResetRepository } from "../../src/db/repos/pw_reset.repo";
import { TempToken } from "../../src/shared/entities/temp_token.entity";
import { hashPassword } from "../../src/shared/utils/pwHash";
import { UserDto } from "../../src/user/dto/UserResponse";
import { UserRepository } from "../../src/user/repository/user.repository";
import { UserController } from "../../src/user/user.controller";
import { User, UserRole } from "../../src/user/user.entity";
import { UserService } from "../../src/user/user.service";
import { connStr, defaultTenant } from "../../test/setup";

describe("UserController (e2e)", () => {
	let app: NestApplication;
	let adminUser: User;
	let authService: AuthService;
	let userRepository: UserRepository;
	let req: request.SuperTest<request.Test>;
	let adminJwt: string;
	const password = "admin_p@ssW0rd";
	const endpoint = "/users";
	beforeAll(async () => {
		const typegooseConfig = TypegooseModule.forRoot(connStr, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		});
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				TypegooseModule.forFeature([User, TempToken]),
				typegooseConfig,
				AuthModule
			],
			exports: [UserService, UserRepository, TempPwResetRepository],
			providers: [UserService, UserRepository, TempPwResetRepository],
			controllers: [UserController]
		}).compile();

		app = module.createNestApplication();
		authService = await module.resolve<AuthService>(AuthService);
		userRepository = await module.resolve<UserRepository>(UserRepository);
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

	const createUserInput: RegisterInput = {
		email: "john.doe@email.com",
		firstName: "John",
		lastName: "Doe",
		username: "john",
		password
	};
	let headers: object;
	let createdUser: UserDto;
	describe("Admin User CRUD Operations", () => {
		beforeAll(
			() =>
				(headers = {
					[headerConstants.tenantIdKey]: defaultTenant.id,
					[headerConstants.authorizationKey]: `Bearer ${adminJwt}`
				})
		);
		it("should create a new user", async () => {
			const { body } = await req
				.post(endpoint)
				.set(headers)
				.send(createUserInput)
				.expect(HttpStatus.CREATED);

			const userRecFromDb = await User.getModel().findById(body.id);

			expect(body).toHaveProperty("id");
			expect(userRecFromDb.createdBy.toString()).toEqual(
				adminUser.id.toString()
			);

			expect(adminUser.tenant.toString()).toEqual(
				userRecFromDb.tenant.toString()
			);

			expect(userRecFromDb.tenant.toString()).toEqual(
				adminUser.tenant.toString()
			);
			createdUser = body;
		});
		it("should get all users", async () => {
			const input: GetAllInput = { search: createdUser.username };
			const { body } = await req
				.get(endpoint)
				.query(input)
				.set(headers)
				.expect(HttpStatus.OK);

			const { totalCount, items } = body;
			const { password, ...withoutPw } = createUserInput;

			expect(items.length).toBe(1);
			expect(totalCount).toBeGreaterThan(1);
			expect(items[0]).toMatchObject(withoutPw);
		});
		it("should get a user by ID", async () => {
			const { body } = await req
				.get(`${endpoint}/${createdUser.id}`)
				.set(headers)
				.expect(HttpStatus.OK);

			expect(body).toMatchObject(createdUser);
		});
		it("should return email conflict if admin user tries to create user with the same email", async () => {
			const newUser = { ...createUserInput };
			newUser.username += "nonConflictUsername";

			await req
				.post(endpoint)
				.send(newUser)
				.set(headers)
				.expect(HttpStatus.CONFLICT);
		});
		it("should return username conflict if admin user tries to create user with the same username", async () => {
			const newUser = { ...createUserInput };
			newUser.email = "newMail@gmail.com";

			await req
				.post(endpoint)
				.send(newUser)
				.set(headers)
				.expect(HttpStatus.CONFLICT);
		});
		it("should update a user if user is admin", async () => {
			const userUpdateInput: Partial<UserDto> = {
				id: createdUser.id,
				email: "updated_email@mail.com"
			};
			await req
				.put(endpoint)
				.set(headers)
				.send(userUpdateInput)
				.expect(HttpStatus.NO_CONTENT);

			const userRec = await User.getModel().findById(userUpdateInput.id);

			expect(userUpdateInput.email.toLowerCase()).toEqual(userRec.email);
			expect(userRec.updatedBy.toString()).toEqual(adminUser.id.toString());

			createdUser = plainToClass(UserDto, userRec, {
				enableImplicitConversion: true,
				excludeExtraneousValues: true
			});
		});
		it("should soft-delete a user if signed-in user is admin", async () => {
			await req
				.delete(`${endpoint}/${createdUser.id}`)
				.set(headers)
				.expect(HttpStatus.NO_CONTENT);

			let undefinedUserRec = await userRepository.findById(createdUser.id);
			let userRec = await User.getModel().findById(createdUser.id);

			expect(undefinedUserRec).toBeUndefined();
			expect(userRec.deletedBy.toString()).toEqual(adminUser.id.toString());
			expect(userRec.tenant.toString()).toEqual(adminUser.tenant.toString());
			expect(userRec.deletedAt).toBeTruthy();
		});
		it("should return forbidden for non admin user while trying to create user", async () => {
			adminUser.setRoles(UserRole.USER);
			const { access_token } = await authService.generateJwt(adminUser);
			headers[headerConstants.authorizationKey] = `Bearer ${access_token}`;
			await req
				.post(endpoint)
				.set(headers)
				.send(createUserInput)
				.expect(HttpStatus.FORBIDDEN);
		});
		afterAll(async () => {
			await app.close();
		});
	});
});
