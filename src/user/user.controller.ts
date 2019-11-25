import { Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiUseTags } from "@nestjs/swagger";

@ApiUseTags("Users")
@Controller("users")
export class UserController {
	@UseGuards(AuthGuard("jwt"))
	@ApiBearerAuth()
	@Post()
	async createUser() {}
}
