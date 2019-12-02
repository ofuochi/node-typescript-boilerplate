import { TypegooseModule } from "nestjs-typegoose";

import { Test, TestingModule } from "@nestjs/testing";

import { ConfigModule } from "../../src/config/config.module";
import { ConfigService } from "../../src/config/config.service";
import { CreateRoleInput } from "./dto/CreateRoleInput";
import { RoleController } from "./role.controller";
import { Role } from "./role.entity";
import { RoleModule } from "./role.module";
import { RoleService } from "./role.service";

jest.mock("./role.service");

describe("Role Controller", () => {
	let controller: RoleController;
	let service: RoleService;
	let role: Role;

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
			imports: [typegooseConfig, RoleModule],
			controllers: [RoleController]
		}).compile();

		controller = module.get<RoleController>(RoleController);
		service = module.get<RoleService>(RoleService);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
	it("should create role", async () => {
		const input: CreateRoleInput = {
			name: "Name",
			description: "Description"
		};
		role = Role.createInstance(input.name, input.description);
		role = { ...role, id: "id" } as Role;
		jest.spyOn(service, "create").mockReturnValue(Promise.resolve(role));

		const roleDto = await controller.createRole(input);
		expect(role).toMatchObject(roleDto);
		expect(service.create).toHaveBeenNthCalledWith(
			1,
			input.name,
			input.description
		);
	});
});
