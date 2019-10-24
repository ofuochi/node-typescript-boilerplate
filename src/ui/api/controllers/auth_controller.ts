import { plainToClass } from "class-transformer";
import { inject } from "inversify";
import { Body, Post, Route, Security, Tags } from "tsoa";
import { provideSingleton } from "../../../infrastructure/config/ioc";
import {
    UserSignInInput,
    UserSignUpDto,
    UserSignUpInput
} from "../../models/user_dto";
import { AuthService } from "../../services/auth_service";
import { BaseController } from "./base_controller";
import { IAuthService } from "../../../domain/services/auth_service";

@Tags("Auth")
@Route("auth")
@provideSingleton(AuthController)
export class AuthController extends BaseController {
    @inject(AuthService) private readonly _authService: IAuthService;

    @Post("signUp")
    @Security("X-Tenant-Id")
    public async signUp(
        @Body() input: UserSignUpInput
    ): Promise<UserSignUpDto> {
        await this.checkBadRequest(plainToClass(UserSignUpInput, input));
        return this._authService.signUp(input);
    }

    @Post("signIn")
    @Security("X-Tenant-Id")
    public async signIn(@Body() input: UserSignInInput) {
        await this.checkBadRequest(plainToClass(UserSignInInput, input));
        return this._authService.signIn(input);
    }
}
