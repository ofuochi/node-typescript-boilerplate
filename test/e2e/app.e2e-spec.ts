import { NestApplication } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { CommandModule } from "nestjs-command";
import { TypegooseModule } from "nestjs-typegoose";
import { AppService } from "../../src/app.service";
import { AuthModule } from "../../src/auth/auth.module";
import { ConfigModule } from "../../src/config/config.module";
import { ConfigService } from "../../src/config/config.service";
import { TenantModule } from "../../src/tenant/tenant.module";
import { UserModule } from "../../src/user/user.module";

const typegooseConfig = TypegooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (config: ConfigService) => {
    return {
      uri: config.env.mongoDbUri,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    };
  },
  inject: [ConfigService],
});
describe("AppController (e2e)", () => {
  let app: NestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        ConfigModule,
        CommandModule,
        UserModule,
        TenantModule,
        typegooseConfig,
      ],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/ (GET)", async () => {
    // await request(app.getHttpServer())
    //   .get("/")
    //   .expect(200)
    //   .expect("Hello World!");
  });
  afterAll(async () => {
    await app.close();
  });
});
