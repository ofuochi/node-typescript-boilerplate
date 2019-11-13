import { Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiUseTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiUseTags("Users")
@Controller("user")
export class UserController {
  @UseGuards(AuthGuard("jwt"))
  @ApiBearerAuth()
  @Post()
  async createUser() {}
}
