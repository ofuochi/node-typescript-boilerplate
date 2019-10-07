import { plainToClass } from "class-transformer";
import { controller, httpPost, requestBody } from "inversify-express-utils";

import { authService } from "../../../domain/constants/decorators";
import { IAuthService } from "../../interfaces/auth_service";
import {
    UserSignInInput,
    UserSignUpDto,
    UserSignUpInput
} from "../../models/user_dto";
import { BaseController } from "./base_controller";

@controller("/auth")
export class AuthController extends BaseController {
    @authService private _authService: IAuthService;

    @httpPost("/signUp")
    public async post(@requestBody() input: UserSignUpInput) {
        /* For some strange reason, "input" is not not a real instance of UserSignUpInput.
          Calling the method plainToClass does the trick 🙂 */
        input = plainToClass(UserSignUpInput, input);
        const badRequest = await this.checkBadRequest(input);
        if (badRequest) return badRequest;
        const result = await this._authService.signUp(input);
        const signUpDto: UserSignUpDto = {
            userDto: result.userDto,
            token: result.token
        };
        return signUpDto;
    }

    @httpPost("/signIn")
    public async getById(@requestBody() input: UserSignInInput) {
        return this._authService.signIn(input);
    }
}
