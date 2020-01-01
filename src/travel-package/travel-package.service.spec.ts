import { HttpModule } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypegooseModule } from "nestjs-typegoose";
import { ConfigModule } from "../../src/config/config.module";
import { ConfigService } from "../config/config.service";
import { TravelPackageModule } from "./travel-package.module";
import { TravelPackageService } from "./travel-package.service";

describe("TravelPackageService", () => {
	let service: TravelPackageService;

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
			imports: [typegooseConfig, TravelPackageModule, HttpModule, ConfigModule],
			providers: [TravelPackageService]
		}).compile();

		service = module.get<TravelPackageService>(TravelPackageService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
