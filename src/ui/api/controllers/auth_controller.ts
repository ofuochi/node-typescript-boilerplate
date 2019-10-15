import { plainToClass } from "class-transformer";
import { inject } from "inversify";
import { Body, Post, Route, Security, Tags } from "tsoa";
import { provideSingleton } from "../../../infrastructure/config/ioc";
import { IAuthService } from "../../interfaces/auth_service";
import {
    UserSignInInput,
    UserSignUpDto,
    UserSignUpInput
} from "../../models/user_dto";
import { AuthService } from "../../services/auth_service";
import { BaseController } from "./base_controller";

@Tags("Auth")
@Route("auth")
@provideSingleton(AuthController)
export class AuthController extends BaseController {
    constructor(
        @inject(AuthService) private readonly _authService: IAuthService
    ) {
        super();
    }

    @Post("signUp")
    @Security("x-tenant-id")
    public async signUp(
        @Body() input: UserSignUpInput
    ): Promise<UserSignUpDto> {
        await this.checkBadRequest(plainToClass(UserSignUpInput, input));
        const { token, userDto } = await this._authService.signUp(input);
        return { userDto, token };
    }

    @Post("signIn")
    @Security("x-tenant-id")
    public async signIn(@Body() input: UserSignInInput) {
        await this.checkBadRequest(plainToClass(UserSignInInput, input));
        return this._authService.signIn(input);
    }
}
