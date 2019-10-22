import { plainToClass } from "class-transformer";
import httpStatus from "http-status-codes";
import {
    Body,
    Delete,
    Get,
    Post,
    Put,
    Route,
    Security,
    Tags,
    Query
} from "tsoa";
import { inject, provideSingleton } from "../../../infrastructure/config/ioc";
import { HttpError } from "../../error";
import { IUserService } from "../../interfaces/user_service";
import {
    UserDto,
    UserSignUpInput,
    UserUpdateInput
} from "../../models/user_dto";
import { UserService } from "../../services/user_service";
import { BaseController } from "./base_controller";
import { PagedResultDto } from "../../models/base_dto";

@Tags("Users")
@Route("users")
@provideSingleton(UserController)
export class UserController extends BaseController {
    @inject(UserService) private readonly _userService: IUserService;

    @Post()
    @Security("X-Auth-Token", ["admin"])
    public async createUser(@Body() input: UserSignUpInput): Promise<UserDto> {
        await this.checkBadRequest(plainToClass(UserSignUpInput, input));
        const user = await this._userService.create(input);
        return plainToClass(UserDto, user, {
            enableImplicitConversion: true,
            excludeExtraneousValues: true
        });
    }
    @Put("{id}")
    @Security("X-Auth-Token", ["admin"])
    public async updateUser(
        id: string,
        @Body() input: UserUpdateInput
    ): Promise<void> {
        this.checkUUID(id);
        if (!input) return this.setStatus(httpStatus.NO_CONTENT);
        await this.checkBadRequest(plainToClass(UserUpdateInput, input));
        input = JSON.parse(JSON.stringify(input));
        await this._userService.update({ ...input, id });
    }
    @Get("{id}")
    @Security("X-Auth-Token", ["admin"])
    public async getUser(id: string): Promise<UserDto> {
        this.checkUUID(id);
        const user = await this._userService.get({ id });
        if (user)
            return plainToClass(UserDto, user, {
                enableImplicitConversion: true,
                excludeExtraneousValues: true
            });
        throw new HttpError(httpStatus.NOT_FOUND);
    }
    @Get()
    @Security("X-Auth-Token", ["admin"])
    public async getUsers(
        @Query() skipCount?: number,
        @Query() maxResultCount?: number
    ): Promise<PagedResultDto<UserDto>> {
        const { count, items } = await this._userService.pagedGetAll(
            skipCount,
            maxResultCount
        );
        const users = plainToClass(UserDto, items, {
            enableImplicitConversion: true,
            excludeExtraneousValues: true
        });
        return {
            totalCount: count,
            items: users
        };
    }
    @Delete("{id}")
    @Security("X-Auth-Token", ["admin"])
    public async deleteUser(id: string) {
        this.checkUUID(id);
        const isDeleted = await this._userService.delete(id);
        if (!isDeleted) this.setStatus(httpStatus.NOT_FOUND);
    }
}
