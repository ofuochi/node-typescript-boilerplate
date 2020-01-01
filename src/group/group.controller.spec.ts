import { UserRole } from "../user/user.entity";
import { TypegooseModule } from "nestjs-typegoose";

import { Test, TestingModule } from "@nestjs/testing";

import { ConfigModule } from "../../src/config/config.module";
import { ConfigService } from "../../src/config/config.service";
import { CreateGroupInput } from "./dto/CreateGroupInput";
import { GroupController } from "./group.controller";
import { Group } from "./group.entity";
import { GroupModule } from "./group.module";
import { GroupService } from "./group.service";
import { BadRequestException } from "@nestjs/common";

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
			title: "Name",
			size: 6,
			goal: "Group goals",
			expiresAt: new Date(),
			isPublic: true,
			package: "Test"
		};
		const grpDto = { id: "id" } as Group;
		service.create = jest.fn(() => Promise.resolve(grpDto));
		const req = { user: { roles: [UserRole.ADMIN] } };
		expect(await controller.createGroup(input, req)).toMatchObject(grpDto);
		expect(service.create).toHaveBeenNthCalledWith(1, input);
	});
	it("should throw bad request error if non-admin is trying to create a public group", async () => {
		const input: CreateGroupInput = {
			title: "Name",
			size: 6,
			goal: "Group goals",
			expiresAt: new Date(),
			isPublic: true,
			package: "Test"
		};
		const grpDto = { id: "id" } as Group;
		service.create = jest.fn(() => Promise.resolve(grpDto));
		const req = { user: { roles: [UserRole.USER] } };
		try {
			await controller.createGroup(input, req);
		} catch (error) {
			expect(error).toBeInstanceOf(BadRequestException);
			expect(service.create).not.toHaveBeenCalled();
		}
	});
});
