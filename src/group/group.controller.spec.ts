import { GroupDto } from "./dto/GroupDto";
import { TypegooseModule } from "nestjs-typegoose";

import { Test, TestingModule } from "@nestjs/testing";

import { ConfigModule } from "../../src/config/config.module";
import { ConfigService } from "../../src/config/config.service";
import { CreateGroupInput } from "./dto/CreateGroupInput";
import { GroupController } from "./group.controller";
import { GroupModule } from "./group.module";
import { GroupService } from "./group.service";

jest.mock("./group.service.ts");

describe("Group Controller", () => {
	let controller: GroupController;
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
			imports: [typegooseConfig, GroupModule],
			controllers: [GroupController]
		}).compile();

		controller = module.get<GroupController>(GroupController);
		service = module.get<GroupService>(GroupService);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
	it("should create group", async () => {
		const input: CreateGroupInput = {
			size: 6,
			goal: "Group goals",
			expiresAt: new Date(),
			isPublic: true
		};
		const grpDto = { id: "id" } as GroupDto;
		service.create = jest.fn(() => grpDto);
		expect(await controller.createGroup(input)).toMatchObject(grpDto);
		expect(service.create).toHaveBeenNthCalledWith(1, input);
	});
});
