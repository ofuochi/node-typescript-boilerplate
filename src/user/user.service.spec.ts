import { TypegooseModule } from 'nestjs-typegoose';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

describe("UserService", () => {
	let service: UserService;

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
			imports: [typegooseConfig, TypegooseModule.forFeature([User])],
			exports: [UserService, UserRepository],
			providers: [UserService, UserRepository],
			controllers: [UserController]
		}).compile();

		service = module.get<UserService>(UserService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
