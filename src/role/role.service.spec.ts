import { TypegooseModule } from "nestjs-typegoose";

import { Test, TestingModule } from "@nestjs/testing";

import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";
import { RoleController } from "./role.controller";
import { Role } from "./role.entity";
import { RoleRepository } from "./role.repo";
import { RoleService } from "./role.service";

describe("RoleService", () => {
	let service: RoleService;

	beforeEach(async () => {
		const typegooseConfig = TypegooseModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				uri: config.env.mongoDbUri,
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
				useFindAndModify: false
			}),
			inject: [ConfigService]
		});
		const module: TestingModule = await Test.createTestingModule({
			imports: [typegooseConfig, TypegooseModule.forFeature([Role])],
			exports: [RoleService, RoleRepository],
			providers: [RoleService, RoleRepository],
			controllers: [RoleController]
		}).compile();
		service = module.get<RoleService>(RoleService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
