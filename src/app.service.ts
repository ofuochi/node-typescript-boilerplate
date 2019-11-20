import { Command } from 'nestjs-command';

import { Injectable, Logger } from '@nestjs/common';

import { Tenant } from './tenant/tenant.entity';
import { User, UserRole } from './user/user.entity';
import { hashPw } from './utils/pwHash';

@Injectable()
export class AppService {
	@Command({
		command: "seed:db",
		describe: "Seed Database",
		autoExit: true
	})
	async seedDb() {
		Logger.log("Seeding Database...");
		await this.seedDefaultHostAdmin();
		const tenant = await this.seedDefaultTenant();
		await this.seedDefaultAdmin(tenant);
	}

	private async seedDefaultTenant() {
		const tenant = Tenant.createInstance("DEFAULT", "Default tenant");
		const newTenant = await Tenant.getModel().create(tenant);
		Logger.log("Seeded Default Tenant");
		return newTenant;
	}
	private async seedDefaultHostAdmin() {
		const password = await hashPw("123qwe");

		const user = User.createInstance({
			firstName: "Admin",
			lastName: "Admin",
			email: "host@email.com",
			username: "admin",
			password
		});
		user.setRoles([UserRole.ADMIN]);
		await User.getModel().create(user);
		Logger.log("Seeded Default Host Admin");
	}
	private async seedDefaultAdmin(tenant: Tenant) {
		const password = await hashPw("123qwe");

		const user = User.createInstance({
			firstName: "Admin",
			lastName: "Admin",
			email: "admin@email.com",
			username: "admin",
			password,
			tenant
		});
		user.setRoles([UserRole.ADMIN]);
		await User.getModel().create(user);
		Logger.log("Seeded Default Admin");
	}
}
