import { plainToClass } from "class-transformer";
import { inject } from "inversify";
import { controller, httpPost, requestBody } from "inversify-express-utils";
import { IAuthService } from "../../interfaces/auth_service";
import {
    UserSignInInput,
    UserSignUpDto,
    UserSignUpInput
} from "../../models/user_dto";
import { AuthService } from "../../services/auth_service";
import { BaseController } from "./base_controller";

@controller("/auth")
export class AuthController extends BaseController {
    constructor(
        @inject(AuthService) private readonly _authService: IAuthService
    ) {
        super();
    }

    @httpPost("/signUp")
    public async signUp(@requestBody() input: UserSignUpInput) {
        /* For some strange reason, "input" is not not a real instance of UserSignUpInput.
          Calling the method plainToClass does the trick 🙂 */
        input = plainToClass(UserSignUpInput, input);
        await this.checkBadRequest(input);
        const result = await this._authService.signUp(input);
        const signUpDto: UserSignUpDto = {
            userDto: result.userDto,
            token: result.token
        };
        return signUpDto;
    }

    @httpPost("/signIn")
    public async signIn(@requestBody() input: UserSignInInput) {
        return this._authService.signIn(input);
    }
}
