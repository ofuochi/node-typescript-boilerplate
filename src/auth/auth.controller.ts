import { plainToClass } from "class-transformer";

import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Request,
	UseGuards
} from "@nestjs/common";
import {
	ApiCreatedResponse,
	ApiImplicitHeader,
	ApiNoContentResponse,
	ApiOkResponse,
	ApiOperation,
	ApiUseTags
} from "@nestjs/swagger";

import { User } from "../user/user.entity";
import { AuthService } from "./auth.service";
import { headerConstants } from "./constants/header.constant";
import { AuthResponse } from "./dto/AuthResponse";
import { CallbackUrlPropsInput } from "./dto/CallbackUrlPropsInput";
import { LoginInput } from "./dto/LoginInput";
import { RegisterInput } from "./dto/RegisterInput";
import { RegisterResponse } from "./dto/RegisterResponse";
import { LoginGuard } from "./guards/login.guard";
import { TenantGuard } from "./guards/tenant.guard";
import { VerificationInput } from "./dto/VerificationInput";
import { PasswordResetInput } from "./dto/PasswordResetInput";

@ApiUseTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly _authService: AuthService) {}

	@Post("register")
	@ApiImplicitHeader({
		name: headerConstants.tenantIdKey,
		description: "Tenant ID"
	})
	@UseGuards(new TenantGuard())
	@ApiCreatedResponse({ type: RegisterResponse })
	async register(@Body() input: RegisterInput): Promise<RegisterResponse> {
		const user = plainToClass(User, input);
		const result = await this._authService.register(user);
		return plainToClass(RegisterResponse, result);
	}

	@Post("login")
	@ApiOperation({
		description:
			"This returns authorization token. Pass this token in the header for subsequent requests",
		operationId: "Login",
		title: "Generates Access Token"
	})
	@ApiImplicitHeader({
		name: headerConstants.tenantIdKey,
		description: "Tenant ID. Leave empty for host",
		required: false
	})
	@ApiOkResponse({ type: AuthResponse })
	@HttpCode(HttpStatus.OK)
	@UseGuards(new TenantGuard(false), LoginGuard)
	async login(@Body() input: LoginInput, @Request() req: any) {
		return this._authService.generateJwt(req.user);
	}

	@Post("send_password_reset_token")
	@ApiNoContentResponse({
		description: "Sends a password reset token to the user"
	})
	@ApiImplicitHeader({
		name: headerConstants.tenantIdKey,
		description: "Tenant ID"
	})
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(new TenantGuard())
	async sendPwResetToken(@Body() input: CallbackUrlPropsInput) {
		await this._authService.sendPasswordResetToken(input);
	}
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiImplicitHeader({
		name: headerConstants.tenantIdKey,
		description: "Tenant ID"
	})
	@UseGuards(new TenantGuard())
	@Post("send_email_verification_token")
	async sendEmailVerification(@Body() input: CallbackUrlPropsInput) {
		await this._authService.sendEmailVerificationToken(input);
	}
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiImplicitHeader({
		name: headerConstants.tenantIdKey,
		description: "Tenant ID"
	})
	@UseGuards(new TenantGuard())
	@Post("reset_password")
	async resetPassword(@Body() input: PasswordResetInput) {
		await this._authService.resetPassword(input);
	}
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiImplicitHeader({
		name: headerConstants.tenantIdKey,
		description: "Tenant ID"
	})
	@UseGuards(new TenantGuard())
	@Post("verify_email")
	async verifyUserEmail(@Body() input: VerificationInput) {
		await this._authService.verifyUserEmail(input);
	}
}
