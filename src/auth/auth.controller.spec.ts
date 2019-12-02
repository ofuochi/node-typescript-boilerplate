import { VerificationInput } from "./dto/VerificationInput";
import { PasswordResetInput } from "./dto/PasswordResetInput";
import { Test, TestingModule } from "@nestjs/testing";

import { MailService } from "../shared/services/mail.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CallbackUrlPropsInput } from "./dto/CallbackUrlPropsInput";
import { LoginInput } from "./dto/LoginInput";
import { RegisterInput } from "./dto/RegisterInput";

jest.mock("./auth.service");

describe("Auth Controller", () => {
	let authCtrl: AuthController;
	let authService: AuthService;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthService, MailService],
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
	const callbackUrlPropsInput: CallbackUrlPropsInput = {
		clientBaseUrl: "https://www.baseurl.com",
		email: registerInput.email,
		emailParameterName: "email",
		verificationCodeParameterName: "token"
	};
	it("should send password reset token", async () => {
		jest.spyOn(authService, "sendPasswordResetToken");

		await authCtrl.sendPwResetToken(callbackUrlPropsInput);
		expect(authService.sendPasswordResetToken).toHaveBeenNthCalledWith(
			1,
			callbackUrlPropsInput
		);
	});
	it("should send email verification token", async () => {
		jest.spyOn(authService, "sendEmailVerificationToken");

		await authCtrl.sendPwResetToken(callbackUrlPropsInput);
		expect(authService.sendPasswordResetToken).toHaveBeenNthCalledWith(
			1,
			callbackUrlPropsInput
		);
	});
	it("should reset password", async () => {
		jest.spyOn(authService, "resetPassword");
		const input: PasswordResetInput = {
			email: registerInput.email,
			newPassword: "new_pa@s@W0rd",
			token: "token"
		};
		await authCtrl.resetPassword(input);
		expect(authService.resetPassword).toHaveBeenNthCalledWith(1, input);
	});
	it("should verify email", async () => {
		jest.spyOn(authService, "verifyUserEmail");
		const input: VerificationInput = {
			email: registerInput.email,
			token: "token"
		};
		await authCtrl.verifyUserEmail(input);
		expect(authService.verifyUserEmail).toHaveBeenNthCalledWith(1, input);
	});
});
