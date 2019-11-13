import { Injectable, Logger } from "@nestjs/common";
import { ReturnModelType } from "@typegoose/typegoose";
import { InjectModel } from "nestjs-typegoose";
import { Tenant } from "../tenant/tenant.entity";
import { User } from "../user/user.entity";

@Injectable()
export class DbService {
  constructor(
    @InjectModel(Tenant)
    private readonly _tenantRepository: ReturnModelType<typeof Tenant>,
    @InjectModel(User)
    private readonly _userRepository: ReturnModelType<typeof User>,
  ) {}

  async seedDb() {
    await this.seedDefaultHostAdmin();
    const tenant = await this.seedTenant();
    await this.seedDefaultAdmin(tenant);
    Logger.log("Seeded database");
  }

  private async seedTenant() {
    const tenant = Tenant.createInstance("DEFAULT", "Default tenant");
    return this._tenantRepository.create(tenant);
  }
  private async seedDefaultHostAdmin() {
    const user = User.createInstance({
      firstName: "Admin",
      lastName: "Admin",
      password: "123qwe",
      email: "host@email.com",
      username: "admin",
    });
    await this._userRepository.create(user);
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
    await this._userRepository.create(user);
  }
}
