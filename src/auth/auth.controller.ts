import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import {
  ApiCreatedResponse,
  ApiImplicitHeader,
  ApiOkResponse,
  ApiOperation,
  ApiUseTags,
} from "@nestjs/swagger";
import { plainToClass } from "class-transformer";
import { User } from "../user/user.entity";
import { AuthService } from "./auth.service";
import { AuthResponse } from "./dto/AuthResponse";
import { LoginInput } from "./dto/LoginInput";
import { RegisterInput } from "./dto/RegisterInput";
import { RegisterResponse } from "./dto/RegisterResponse";
import { LoginGuard } from "./guards/login.guard";
import { TenantGuard } from "./guards/tenant.guard";
import { headerConstants } from "./constants/header.constant";

@ApiUseTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @ApiImplicitHeader({
    name: headerConstants.tenantIdKey,
    description: "Tenant ID",
  })
  @Post("register")
  @UseGuards(new TenantGuard())
  @ApiCreatedResponse({ type: RegisterResponse })
  async register(@Body() input: RegisterInput): Promise<RegisterResponse> {
    const user = plainToClass(User, input);
    const result = await this._authService.register(user);
    return plainToClass(RegisterResponse, result);
  }

  @ApiOperation({
    description:
      "This returns authorization token. Pass this token in the header for subsequent requests",
    operationId: "Login",
    title: "Generates Access Token",
  })
  @ApiImplicitHeader({
    name: headerConstants.tenantIdKey,
    description: "Tenant ID. Leave empty for host",
    required: false,
  })
  @ApiOkResponse({ type: AuthResponse })
  @HttpCode(HttpStatus.OK)
  @UseGuards(new TenantGuard(false), LoginGuard)
  @Post("login")
  async login(@Body() input: LoginInput, @Request() req: any) {
    return this._authService.generateJwt(req.user);
  }
}
