import { plainToClass } from "class-transformer";

import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	UseGuards,
	Put,
	HttpCode,
	HttpStatus,
	Delete
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import {
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiUseTags
} from "@nestjs/swagger";

import { RegisterInput } from "../auth/dto/RegisterInput";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../decorators/roles.decorator";
import { PagedResultDto } from "../shared/dto/base.dto";
import { GetAllInput } from "../shared/dto/GetAll";
import { validId } from "../shared/utils/validId";
import { PagedUserDto } from "./dto/PagedUserDto";
import { UserDto } from "./dto/UserResponse";
import { UserRole } from "./user.entity";
import { UserService } from "./user.service";

@ApiUseTags("Users")
@Controller("users")
@UseGuards(AuthGuard("jwt"), RolesGuard)
@ApiBearerAuth()
export class UserController {
	constructor(private readonly _userService: UserService) {}

	@Post()
	@ApiCreatedResponse({
		type: UserDto
	})
	@Roles(UserRole.HOST, UserRole.ADMIN)
	async createUser(@Body() input: RegisterInput): Promise<UserDto> {
		const user = await this._userService.createUser(input);
		return plainToClass(UserDto, user, {
			enableImplicitConversion: true,
			excludeExtraneousValues: true
		});
	}

	@Get()
	@ApiOkResponse({
		type: PagedUserDto
	})
	@Roles(UserRole.HOST, UserRole.ADMIN)
	async getUsers(
		@Query() input: GetAllInput
	): Promise<PagedResultDto<UserDto>> {
		const { totalCount, items } = await this._userService.pagedGetAll(input);
		const results = plainToClass(UserDto, items, {
			enableImplicitConversion: true,
			excludeExtraneousValues: true
		});
		return {
			totalCount,
			items: results
		};
	}

	@Get(":id")
	@ApiCreatedResponse({
		type: UserDto
	})
	@Roles(UserRole.HOST, UserRole.ADMIN)
	async getUser(@Param("id") id: string): Promise<UserDto> {
		if (!validId(id)) throw new BadRequestException(`${id} is not a valid ID`);
		const user = await this._userService.getById(id);
		return plainToClass(UserDto, user, {
			enableImplicitConversion: true,
			excludeExtraneousValues: true
		});
	}
	@Put()
	@HttpCode(HttpStatus.NO_CONTENT)
	@Roles(UserRole.HOST, UserRole.ADMIN)
	async updateUser(@Body() input: UserDto): Promise<void> {
		await this._userService.update(input);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.NO_CONTENT)
	@Roles(UserRole.HOST, UserRole.ADMIN)
	async deleteTenant(@Param("id") id: string) {
		await this._userService.deleteById(id);
	}
}
