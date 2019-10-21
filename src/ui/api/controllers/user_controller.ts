import { plainToClass } from "class-transformer";
import httpStatus from "http-status-codes";
import { Body, Delete, Get, Post, Put, Route, Security, Tags } from "tsoa";
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

@Tags("Users")
@Route("users")
@provideSingleton(UserController)
export class UserController extends BaseController {
    @inject(UserService) private readonly _userService: IUserService;

    @Post()
    @Security("X-Auth-Token", ["admin"])
    public async create(@Body() input: UserSignUpInput): Promise<UserDto> {
        await this.checkBadRequest(plainToClass(UserSignUpInput, input));
        return this._userService.create(input);
    }
    @Put("{id}")
    @Security("X-Auth-Token", ["admin"])
    public async update(
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
    public async get(id: string): Promise<UserDto> {
        this.checkUUID(id);
        const userDto = await this._userService.get(id);
        if (userDto) return userDto;
        throw new HttpError(httpStatus.NOT_FOUND);
    }
    @Get()
    @Security("X-Auth-Token", ["admin"])
    public async getAll(): Promise<UserDto[]> {
        return this._userService.getAll();
    }
    @Delete("{id}")
    @Security("X-Auth-Token", ["admin"])
    public async delete(id: string) {
        this.checkUUID(id);
        const isDeleted = await this._userService.delete(id);
        if (!isDeleted) this.setStatus(httpStatus.NOT_FOUND);
    }
}
