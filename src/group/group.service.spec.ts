import { TypegooseModule } from "nestjs-typegoose";

import { Test, TestingModule } from "@nestjs/testing";

import { ConfigModule } from "../../src/config/config.module";
import { ConfigService } from "../../src/config/config.service";
import { GroupController } from "./group.controller";
import { Group } from "./group.entity";
import { GroupRepository } from "./group.repo";
import { GroupService } from "./group.service";

describe("GroupService", () => {
	let service: GroupService;

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
			imports: [typegooseConfig, TypegooseModule.forFeature([Group])],
			exports: [GroupService, GroupRepository],
			providers: [GroupService, GroupRepository],
			controllers: [GroupController]
		}).compile();
		service = module.get<GroupService>(GroupService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	it("should create group", async () => {});
});
