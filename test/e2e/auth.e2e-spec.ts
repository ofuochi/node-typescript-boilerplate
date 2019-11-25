import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { TypegooseModule } from "nestjs-typegoose";
import * as request from "supertest";

import { HttpStatus, ValidationPipe } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";

import { AuthController } from "../../src/auth/auth.controller";
import { AuthModule } from "../../src/auth/auth.module";
import { AuthService } from "../../src/auth/auth.service";
import { headerConstants } from "../../src/auth/constants/header.constant";
import { CallbackUrlPropsInput } from "../../src/auth/dto/CallbackUrlPropsInput";
import { LoginInput } from "../../src/auth/dto/LoginInput";
import { RegisterInput } from "../../src/auth/dto/RegisterInput";
import { RegisterResponse } from "../../src/auth/dto/RegisterResponse";
import { VerificationInput } from "../../src/auth/dto/VerificationInput";
import { SessionSerializer } from "../../src/auth/session.serializer";
import { JwtStrategy } from "../../src/auth/strategies/jwt.strategy";
import { ConfigModule } from "../../src/config/config.module";
import { TempToken } from "../../src/shared/entities/temp_token.entity";
import { MailService } from "../../src/shared/services/mail.service";
import { Tenant } from "../../src/tenant/tenant.entity";
import { User } from "../../src/user/user.entity";
import { UserModule } from "../../src/user/user.module";
import { config, connStr, defaultTenant } from "../setup";
import { PasswordResetInput } from "../../src/auth/dto/PasswordResetInput";

describe("AuthController (e2e)", () => {
	const endpoint = "/auth";
	let app: NestApplication;
	let req: request.SuperTest<request.Test>;
	let tenant2: Tenant;
	let userId: any;

	beforeAll(async () => {
		const typegooseConfig = TypegooseModule.forRoot(connStr, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		});
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				UserModule,
				ConfigModule,
				typegooseConfig,
				AuthModule,
				PassportModule.register({ session: true }),
				JwtModule.register({
					secret: config.jwtSecret,
					signOptions: { expiresIn: "2 days" }
				})
			],
			providers: [AuthService, JwtStrategy, SessionSerializer, MailService],
			controllers: [AuthController]
		}).compile();

		app = module.createNestApplication();

		app.useGlobalPipes(
			new ValidationPipe({
				whitelist: true,
				forbidNonWhitelisted: true,
				transform: true,
				transformOptions: { enableImplicitConversion: true }
			})
		);
		await app.init();

		req = request(app.getHttpServer());
	});

	const registerInput: RegisterInput = {
		firstName: "string",
		lastName: "string",
		email: "email@sample.com",
		username: "string",
		password: "string"
	};
	describe("User registration", () => {
		it("should sign-up a new user and return token. Creator should be the signed up user", async () => {
			const { body } = await req
				.post(`${endpoint}/register`)
				.set(headerConstants.tenantIdKey, defaultTenant.id)
				.send(registerInput)
				.expect(HttpStatus.CREATED);

			const { canLogin, access_token } = body as RegisterResponse;

			expect(access_token).toBeTruthy();
			expect(canLogin).toBe(true);

			const { createdBy, tenant, id } = await User.getModel()
				.findOne()
				.sort("-createdAt");
			expect(createdBy.toString()).toBe(id);
			expect(tenant.toString()).toBe(defaultTenant.id);

			userId = id;
		});
		it("should return conflict if email already exists on the same tenant", async () => {
			const input = { ...registerInput };
			input.username = `!${input.username}`;
			await req
				.post(`${endpoint}/register`)
				.set(headerConstants.tenantIdKey, defaultTenant.id)
				.send(input)
				.expect(HttpStatus.CONFLICT);
		});
		it("should return conflict if username already exists on the same tenant", async () => {
			const input = { ...registerInput };
			input.email = `!${input.email}`;

			await req
				.post(`${endpoint}/register`)
				.set(headerConstants.tenantIdKey, defaultTenant.id)
				.send(input)
				.expect(HttpStatus.CONFLICT);
		});
		it("should return bad request for invalid inputs", async () => {
			const input = { ...registerInput };
			input.email = "invalid_email";
			input.username = "";
			await req
				.post(`${endpoint}/register`)
				.set(headerConstants.tenantIdKey, defaultTenant.id)
				.send(input)
				.expect(HttpStatus.BAD_REQUEST);
		});
		it("should return bad request for invalid tenant id", async () => {
			await req
				.post(`${endpoint}/register`)
				.set(headerConstants.tenantIdKey, `${defaultTenant.id}!`)
				.send(registerInput)
				.expect(HttpStatus.BAD_REQUEST);
		});
		it("should sign-up a new user on a different tenant with the same details as another tenant", async () => {
			tenant2 = await Tenant.getModel().create(
				Tenant.createInstance("Tenant2", "Tenant2")
			);
			const { body } = await req
				.post(`${endpoint}/register`)
				.set(headerConstants.tenantIdKey, tenant2.id)
				.send(registerInput)
				.expect(HttpStatus.CREATED);
			expect(body.access_token).toBeTruthy();
			expect(body.canLogin).toBe(true);
		});
	});
	describe("User login", () => {
		describe("Valid User login", () => {
			const loginInput: LoginInput = {
				password: registerInput.password,
				emailOrUsername: registerInput.email
			};

			it("should sign-in user with email and return token", async () => {
				const { body } = await req
					.post(`${endpoint}/login`)
					.set(headerConstants.tenantIdKey, defaultTenant.id)
					.send(loginInput)
					.expect(HttpStatus.OK);
				expect(body).toHaveProperty("access_token");
			});
			it("should sign-in user with username and return token", async () => {
				loginInput.emailOrUsername = registerInput.username;
				const { body } = await req
					.post(`${endpoint}/login`)
					.set(headerConstants.tenantIdKey, defaultTenant.id)
					.send(loginInput)
					.expect(HttpStatus.OK);
				expect(body).toHaveProperty("access_token");
			});
			it("should sign-in user that has same username on a different tenant using username and return token", async () => {
				loginInput.emailOrUsername = registerInput.username;
				const { body } = await req
					.post(`${endpoint}/login`)
					.set(headerConstants.tenantIdKey, tenant2.id)
					.send(loginInput)
					.expect(HttpStatus.OK);
				expect(body).toHaveProperty("access_token");
			});
			it("should sign-in user that has same email on a different tenant using email and return token", async () => {
				loginInput.emailOrUsername = registerInput.email;
				const { body } = await req
					.post(`${endpoint}/login`)
					.set(headerConstants.tenantIdKey, tenant2.id)
					.send(loginInput)
					.expect(HttpStatus.OK);
				expect(body).toHaveProperty("access_token");
			});
		});
		describe("Invalid User sign-in", () => {
			let invalidLoginInput: LoginInput;
			let maxLoginAttempts: number;
			let userId: string;
			beforeEach(async () => {
				maxLoginAttempts = config.maxLoginAttempts;
				const userInDb = await User.getModel().findOne();
				invalidLoginInput = {
					emailOrUsername: userInDb.email,
					password: "invalid_password"
				};
				userId = userInDb.id;
				userInDb.clearLockOut();
				await User.getModel().updateOne({ _id: userInDb.id }, userInDb);
			});

			it("should increase user sign-in attempts by 1 when use sign-in fails due to invalid password", async () => {
				const userInitial = await User.getModel().findById(userId);
				await req
					.post(`${endpoint}/login`)
					.set(headerConstants.tenantIdKey, defaultTenant.id)
					.send(invalidLoginInput);

				const userFinal = await User.getModel().findById(userId);

				expect(userFinal.failedSignInAttempts).toEqual(
					userInitial.failedSignInAttempts + 1
				);
			});
			it("should lockout user immediately after making the maximum allowed consecutive sign-in attempts", async () => {
				const signIns: Test[] = [];
				const array = Array.from(Array(maxLoginAttempts).keys());

				array.forEach(() => {
					signIns.push(
						req
							.post(`${endpoint}/login`)
							.set(headerConstants.tenantIdKey, defaultTenant.id)
							.send(invalidLoginInput)
					);
				});
				await Promise.all(signIns);

				const user = await User.getModel().findOne({
					tenant: defaultTenant.id,
					email: invalidLoginInput.emailOrUsername
				});
				expect(user.isLockedOut(maxLoginAttempts)).toBe(true);
			});

			it("should NOT increase sign-in attempts when user is on lockout", async () => {
				const signIns: Test[] = [];
				const array = Array.from(Array(maxLoginAttempts + 3).keys());

				array.forEach(() => {
					signIns.push(
						req
							.post(`${endpoint}/login`)
							.set(headerConstants.tenantIdKey, defaultTenant.id)
							.send(invalidLoginInput)
					);
				});
				await Promise.all(signIns);

				const userFinal = await User.getModel().findOne({
					tenant: defaultTenant.id,
					email: invalidLoginInput.emailOrUsername
				});
				expect(userFinal.failedSignInAttempts).toEqual(maxLoginAttempts);
			});
		});
	});
	describe("User account auth operations", () => {
		const callbackUrlInput: CallbackUrlPropsInput = {
			email: registerInput.email,
			clientBaseUrl: "http://www.clientbaseurl.com",
			emailParameterName: "email",
			verificationCodeParameterName: "verification_code"
		};
		let callbackUrlToken: string;
		it("should send password reset token to user", async () => {
			jest
				.spyOn(crypto, "randomBytes")
				.mockImplementationOnce((size: number) => {
					const buffer = Buffer.alloc(size);
					callbackUrlToken = buffer.toString("hex");
					return buffer;
				});

			await req
				.post(`${endpoint}/send_password_reset_token`)
				.set(headerConstants.tenantIdKey, defaultTenant.id)
				.send(callbackUrlInput)
				.expect(HttpStatus.NO_CONTENT);

			// Get the just created TemPasswordReset
			let tempPw = await TempToken.getModel()
				.findOne()
				.sort("-createdAt");

			expect(tempPw).toBeDefined();
			expect(tempPw.token).toBeDefined();
		});
		it("should return 404 non-existing email tries to send password reset token", async () => {
			await req
				.post(`${endpoint}/send_password_reset_token`)
				.set(headerConstants.tenantIdKey, defaultTenant.id)
				.send({ ...callbackUrlInput, email: "non_existing@email.com" })
				.expect(HttpStatus.NOT_FOUND);
		});
		let passwordResetInput: PasswordResetInput;
		it("should reset user password", async () => {
			passwordResetInput = {
				newPassword: "new_password",
				email: registerInput.email,
				token: callbackUrlToken
			};

			await req
				.post(`${endpoint}/reset_password`)
				.set(headerConstants.tenantIdKey, defaultTenant.id)
				.send(passwordResetInput)
				.expect(HttpStatus.NO_CONTENT);

			const { password } = await User.getModel().findById(userId);
			const isCorrectPassword = await bcrypt.compare(
				passwordResetInput.newPassword,
				password
			);
			const tempToken = await TempToken.getModel()
				.findOne()
				.sort("-createdAt");

			expect(tempToken.isDeleted).toBe(true);
			expect(isCorrectPassword).toBe(true);

			tempToken.set("isDeleted", false);
			await tempToken.save();
		});
		it("should return unauthorized for wrong password reset token", async () => {
			passwordResetInput = {
				newPassword: "new_password",
				email: registerInput.email,
				token: "wrong_password_reset_token"
			};

			await req
				.post(`${endpoint}/reset_password`)
				.set(headerConstants.tenantIdKey, defaultTenant.id)
				.send(passwordResetInput)
				.expect(HttpStatus.UNAUTHORIZED);
		});
		it("should return 404 for non existing email", async () => {
			await req
				.post(`${endpoint}/reset_password`)
				.set(headerConstants.tenantIdKey, defaultTenant.id)
				.send({ ...passwordResetInput, email: "invalid_email@mail.com" })
				.expect(HttpStatus.NOT_FOUND);
		});
		it("should return unauthorized for invalid token", async () => {
			await req
				.post(`${endpoint}/reset_password`)
				.set(headerConstants.tenantIdKey, defaultTenant.id)
				.send({ ...passwordResetInput, token: "invalid_token" })
				.expect(HttpStatus.UNAUTHORIZED);
		});
		it("should send email verification code", async () => {
			const emailVerificationInput = {
				...callbackUrlInput,
				email: registerInput.email
			};

			await req
				.post(`${endpoint}/send_email_verification_token`)
				.set(headerConstants.tenantIdKey, defaultTenant.id)
				.send(emailVerificationInput)
				.expect(HttpStatus.NO_CONTENT);
		});
		it("should verify email via the email verification token", async () => {
			const verificationInput: VerificationInput = {
				email: registerInput.email,
				token: callbackUrlToken
			};
			await req
				.post(`${endpoint}/verify_email`)
				.set(headerConstants.tenantIdKey, defaultTenant.id)
				.send(verificationInput)
				.expect(HttpStatus.NO_CONTENT);

			const { isEmailVerified } = await User.getModel().findById(userId);

			const tempToken = await TempToken.getModel()
				.findOne()
				.sort("-createdAt");

			expect(tempToken.isDeleted).toBe(true);
			expect(isEmailVerified).toBe(true);
		});
	});
	afterAll(async () => {
		await app.close();
	});
});
