import { controller, httpPost, requestBody } from "inversify-express-utils";

import { authService } from "../../../domain/constants/decorators";
import { IAuthService } from "../../interfaces/auth_service";
import { SignInInput, SignUpInput } from "../../models/user_dto";
import { BaseController } from "./base_controller";

@controller("/auth")
export class AuthController extends BaseController {
    @authService public _authService: IAuthService;

    @httpPost("/signUp")
    public async post(@requestBody() input: SignUpInput) {
        return await this._authService.signUp(input);
    }

    @httpPost("/signIn")
    public async getById(@requestBody() input: SignInInput) {
        return await this._authService.signIn(input);
    }
}
