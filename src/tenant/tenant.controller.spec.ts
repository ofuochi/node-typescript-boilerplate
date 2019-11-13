import { Test, TestingModule } from "@nestjs/testing";
import { TenantController } from "./tenant.controller";
import { TenantService } from "./tenant.service";
import { TenantRepository } from "./repository/tenant.repository";
import { TypegooseModule } from "nestjs-typegoose";
import { Tenant } from "./tenant.entity";
import { ConfigModule } from "../config/config.module";
import { ConfigService } from "../config/config.service";

describe("Tenant Controller", () => {
	let controller: TenantController;

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
			imports: [typegooseConfig, TypegooseModule.forFeature([Tenant])],
			exports: [TenantService, TenantRepository],
			providers: [TenantService, TenantRepository],
			controllers: [TenantController]
		}).compile();

		controller = module.get<TenantController>(TenantController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
