import * as failFast from "jasmine-fail-fast";
import * as mongoose from "mongoose";
import { Logger } from "@nestjs/common";
import { MongoMemoryServer } from "mongodb-memory-server";

import { Tenant } from "../src/tenant/tenant.entity";
import { ConfigService, EnvConfig } from "../src/config/config.service";

let config: EnvConfig;
let defaultTenant: Tenant;
let connStr: string;
beforeAll(async () => {
	if (process.argv.includes("--bail")) {
		const jasmineEnv = (jasmine as any).getEnv();
		jasmineEnv.addReporter(failFast.init());
	}
	const mongoServer = new MongoMemoryServer();
	connStr = await mongoServer.getConnectionString();

	await mongoose.connect(
		connStr,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		},
		err => {
			if (err) {
				Logger.error(err);
				process.exit(1);
			}
		}
	);

	defaultTenant = await Tenant.getModel().create(
		Tenant.createInstance("Default", "Default tenant")
	);
	process.env.MONGODB_URI = connStr;
	config = new ConfigService(`${process.env.NODE_ENV || "test"}.env`).env;
});
afterAll(async () => {
	if (mongoose.connection.db) {
		await cleanupDb();
	}
	if (mongoose.connection) {
		await mongoose.disconnect();
	}
});

async function cleanupDb() {
	const collections = await mongoose.connection.db
		.listCollections(undefined, { nameOnly: true })
		.toArray();
	collections.forEach(async (collection: any) => {
		await mongoose.connection.db.dropCollection(collection.name);
	});
}
export { cleanupDb, defaultTenant, config, connStr };
