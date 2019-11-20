import { TypegooseModule } from 'nestjs-typegoose';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { UserController } from './user.controller';

describe("User Controller", () => {
	let controller: UserController;

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
			controllers: [UserController]
		}).compile();

		controller = module.get<UserController>(UserController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
