import { TempToken } from "./../shared/entities/temp_token.entity";
import { TypegooseModule } from "nestjs-typegoose";

import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";

import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { TempPwResetRepository } from "../db/repos/pw_reset.repo";
import { MailService } from "../shared/services/mail.service";
import { UserRepository } from "../user/repository/user.repository";
import { User } from "../user/user.entity";
import { UserModule } from "../user/user.module";
import { hashPassword } from "../shared/utils/pwHash";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { errors } from "./constants/error.constant";
import { SessionSerializer } from "./session.serializer";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { CallbackUrlPropsInput } from "./dto/CallbackUrlPropsInput";

jest.mock("../user/repository/user.repository");
jest.mock("../db/repos/pw_reset.repo");

describe("AuthService", () => {
	let authService: AuthService;
	let userRepo: UserRepository;
	let mailService: MailService;
	let tempPwResetRepo: TempPwResetRepository;
	beforeAll(async () => {
		const typegooseConfig = TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				uri: config.env.mongoDbUri,
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
				useFindAndModify: false
			}),
			inject: [ConfigService]
		});
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				typegooseConfig,
				UserModule,
				ConfigModule,
				PassportModule.register({ session: true }),
				JwtModule.register({
					secret: process.env.JWT_SECRET,
					signOptions: { expiresIn: "2 days" }
				})
			],
			providers: [AuthService, JwtStrategy, SessionSerializer, MailService],
			controllers: [AuthController]
		}).compile();

		authService = await module.resolve<AuthService>(AuthService);
		userRepo = module.get<UserRepository>(UserRepository);
		tempPwResetRepo = await module.resolve<TempPwResetRepository>(
			TempPwResetRepository
		);
		mailService = module.get<MailService>(MailService);
	});
	afterEach(() => jest.resetAllMocks());

	it("should be defined", () => {
		expect(authService).toBeDefined();
	});
	const user = User.createInstance({
		firstName: "John",
		lastName: "Doa",
		username: "username",
		email: "email@gmail.com",
		password: "123qwe"
	});
	it("should register new user", async () => {
		const spy = jest
			.spyOn(userRepo, "insertOrUpdate")
			.mockResolvedValue(Promise.resolve(user));
		const { canLogin, access_token } = await authService.register(user);

		expect(spy).toHaveBeenCalledWith(user);
		expect(canLogin).toBe(true);
		expect(access_token).toBeTruthy();
	});
	it("should generate access token", async () => {
		const res = await authService.generateJwt(user);
		expect(res.access_token).toBeTruthy();
	});
	it("should validate user for correct details", async () => {
		const hashedPw = await hashPassword(user.password);
		const cloneUser = Object.create({ ...user, password: hashedPw }) as User;

		const spyFindOneByQuery = jest
			.spyOn(userRepo, "findOneByQuery")
			.mockResolvedValue(Promise.resolve(cloneUser));
		const spyFindOneByQueryAndUpdate = jest
			.spyOn(userRepo, "findOneByQueryAndUpdate")
			.mockResolvedValue(Promise.resolve(cloneUser));
		cloneUser.isLockedOut = jest.fn((_maxLoginAttempts: number) => false);
		cloneUser.clearLockOut = jest.fn();
		const res = await authService.validateUser(user.email, user.password);
		const { password, ...result } = cloneUser;
		expect(spyFindOneByQuery).toHaveBeenCalled();
		expect(spyFindOneByQueryAndUpdate).toHaveBeenCalled();
		expect(res).toEqual(result);
	});
	it("should throw unauthorized exception for nonexisting user", async () => {
		const spy = jest
			.spyOn(userRepo, "findOneByQuery")
			.mockResolvedValue(Promise.resolve(undefined));

		try {
			await authService.validateUser(user.email, user.password);
		} catch (error) {
			expect(spy).toHaveBeenCalled();
			expect(error).toBeInstanceOf(UnauthorizedException);
			expect(error.message).toEqual(errors.INVALID_LOGIN_ATTEMPT.message);
		}
	});
	it("should throw unauthorized exception for invalid user credentials", async () => {
		const hashedPw = await hashPassword(user.password);
		const cloneUser = { ...user, password: hashedPw } as User;

		const spy = jest
			.spyOn(userRepo, "findOneByQuery")
			.mockResolvedValue(Promise.resolve(cloneUser));

		try {
			await authService.validateUser(user.email, "Wrong_Password");
		} catch (error) {
			expect(spy).toHaveBeenCalled();
			expect(error).toBeInstanceOf(UnauthorizedException);
			expect(error.message).toEqual(errors.INVALID_LOGIN_ATTEMPT.message);
		}
	});
	let input: CallbackUrlPropsInput;
	it("should send password reset token", async () => {
		userRepo.findOneByQuery = jest.fn(() => Promise.resolve(user));
		tempPwResetRepo.insertOrUpdate = jest.fn(() =>
			Promise.resolve(new TempToken())
		);
		mailService.sendMail = jest.fn(() => Promise.resolve());
		input = {
			email: "email@gmail.com",
			clientBaseUrl: "http://www.clientbaseurl.com",
			emailParameterName: "email",
			verificationCodeParameterName: "verification_code"
		};
		await authService.sendPasswordResetToken(input);
		expect(mailService.sendMail).toHaveBeenCalled();
	});
	it("should throw not found exception for nonexisting email", async () => {
		try {
			await authService.sendPasswordResetToken(input);
		} catch (error) {
			expect(error).toBeInstanceOf(NotFoundException);
			expect(mailService.sendMail).toHaveBeenCalledTimes(0);
		}
	});
});
