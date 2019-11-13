import { Injectable } from "@nestjs/common";
import { Command } from "nestjs-command";
import { UserService } from "./user.service";

@Injectable()
export class UserSeed {
  constructor(private readonly _userService: UserService) {}

  @Command({
    command: "create:user",
    describe: "create a user",
    autoExit: true,
  })
  async create() {
    const user = await this._userService.createUser({
      firstName: "Admin",
      lastName: "Admin",
      email: "host.admin@email.com",
      username: "admin",
      password: "123qwe",
    });
    console.log(user);
  }
}
