import { Body, Post, Route, Security, Tags } from "tsoa";
import { inject, provideSingleton } from "../../../infrastructure/config/ioc";
import { IUserService } from "../../interfaces/user_service";
import { UserDto, UserSignUpInput } from "../../models/user_dto";
import { UserService } from "../../services/user_service";
import { BaseController } from "./base_controller";

@Tags("Users")
@Route("users")
@provideSingleton(UserController)
export class UserController extends BaseController {
    @inject(UserService) private readonly _userService: IUserService;

    @Post()
    @Security("X-Auth-Token", ["admin"])
    async create(@Body() input: UserSignUpInput): Promise<UserDto> {
        return this._userService.create(input);
    }
}
