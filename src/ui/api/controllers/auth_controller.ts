import { controller, httpPost, requestBody } from 'inversify-express-utils'
import { classToClass, plainToClass } from 'class-transformer'

import { authService } from '../../../domain/constants/decorators'
import { IAuthService } from '../../interfaces/auth_service'
import { UserSignInInput, UserSignUpDto, UserSignUpInput } from '../../models/user_dto'
import { BaseController } from './base_controller'
import { UserDto } from '../../models/user_dto'

@controller("/auth")
export class AuthController extends BaseController {
    @authService public _authService: IAuthService;

    @httpPost("/signUp")
    public async post(@requestBody() input: UserSignUpInput) {
        /** For some strange reason, "input" is not not a real instance of UserSignUpInput.
         * Calling the method plainToClass does the trick 🙂*/
        input = plainToClass(UserSignUpInput, input);
        const badRequest = await this.checkBadRequest(input);
        if (badRequest) return badRequest;
        console.log(badRequest);
        if (badRequest) return badRequest;
        const result = await this._authService.signUp(input);
        const userDto = classToClass<UserDto>(result.user);
        const signUpDto: UserSignUpDto = {
            userDto,
            token: result.token
        };
        return signUpDto;
    }

    @httpPost("/signIn")
    public async getById(@requestBody() input: UserSignInInput) {
        return await this._authService.signIn(input);
    }
}
