import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/LoginInput';
import { RegisterInput } from './dto/RegisterInput';

jest.mock("./auth.service");

describe("Auth Controller", () => {
	let authCtrl: AuthController;
	let authService: AuthService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthService],
			controllers: [AuthController]
		}).compile();

		authCtrl = module.get<AuthController>(AuthController);
		authService = module.get<AuthService>(AuthService);
	});
	afterEach(() => jest.resetAllMocks());

	it("should be defined", () => {
		expect(authCtrl).toBeDefined();
	});

	const registerInput: RegisterInput = {
		email: "email@gmail.com",
		firstName: "First",
		lastName: "Last",
		password: "P@ss_W0rd",
		username: "username"
	};
	const loginInput: LoginInput = {
		emailOrUsername: "email@gmail.com",
		password: "password"
	};
	it("should register new user", async () => {
		const mockServiceRes = {
			id: "Id",
			canLogin: true,
			access_token: "access_token"
		};
		jest
			.spyOn(authService, "register")
			.mockResolvedValue(Promise.resolve(mockServiceRes));

		expect(await authCtrl.register(registerInput)).toEqual(mockServiceRes);
	});
	it("should return token", async () => {
		const mockServiceRes = { access_token: "access_token" };
		jest
			.spyOn(authService, "generateJwt")
			.mockResolvedValue(Promise.resolve(mockServiceRes));

		expect(await authCtrl.login(loginInput, {})).toBe(mockServiceRes);
	});
});
