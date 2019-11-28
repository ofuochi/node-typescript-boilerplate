import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ScheduleModule } from "nest-schedule";
import { CommandModule } from "nestjs-command";
import { TypegooseModule } from "nestjs-typegoose";
import { AccountModule } from "./account/account.module";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
import { TenantMiddleware } from "./shared/middlewares/tenant.middleware";
import { TenantController } from "./tenant/tenant.controller";
import { TenantModule } from "./tenant/tenant.module";
import { UserModule } from "./user/user.module";
import { RoleModule } from './role/role.module';

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
@Module({
	imports: [
		AuthModule,
		ConfigModule,
		CommandModule,
		UserModule,
		TenantModule,
		typegooseConfig,
		AccountModule,
		ScheduleModule.register(),
		RoleModule
	],
	providers: [AppService]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(TenantMiddleware).forRoutes(TenantController);
	}
}
