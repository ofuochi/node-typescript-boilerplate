import { Injectable, Logger } from "@nestjs/common";
import { Command } from "nestjs-command";
import { Tenant } from "./tenant/tenant.entity";
import { User, UserRole } from "./user/user.entity";
import { hashPw } from "./utils/pwHash";

@Injectable()
export class AppService {
  @Command({
    command: "seed:host",
    describe: "Seed host Admin",
    autoExit: true,
  })
  async seedHost() {
    await this.seedDefaultHostAdmin();
    Logger.log("Seeded Host");
  }
  @Command({
    command: "seed:tenant",
    describe: "Seed tenant",
    autoExit: true,
  })
  async seedTenant() {
    const tenant = Tenant.createInstance("DEFAULT", "Default tenant");
    await Tenant.getModel().create(tenant);
    Logger.log("Seeded Tenant");
  }
  private async seedDefaultHostAdmin() {
    const password = await hashPw("123qwe");

    const user = User.createInstance({
      firstName: "Admin",
      lastName: "Admin",
      email: "host@email.com",
      username: "admin",
      password,
    });
    user.setRoles([UserRole.ADMIN]);
    await User.getModel().create(user);
  }
  private async seedDefaultAdmin(tenant: Tenant) {
    const user = User.createInstance({
      firstName: "Admin",
      lastName: "Admin",
      password: "123qwe",
      email: "admin@email.com",
      username: "admin",
      tenant,
    });
    await User.getModel().create(user);
  }
}
