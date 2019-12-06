import * as passport from "passport";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { ConfigService } from "./config/config.service";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const options = new DocumentBuilder()
		.setTitle("NODE-TYPESCRIPT-BOILERPLATE")
		.setDescription("The NODE-TYPESCRIPT-BOILERPLATE API documentation")
		.setLicense("MIT", "https://opensource.org/licenses/MIT")
		.addBearerAuth({ type: "apiKey", name: "Bearer token", in: "Header" })
		.setVersion("1.0")
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup("api-docs", app, document, {
		customSiteTitle: "API Documentation"
	});

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
				enableCircularCheck: true
			}
		})
	);
	// app.use(
	//   session({
	//     secret: jwtConstants.secret,
	//     resave: false,
	//     saveUninitialized: false,
	//   }),
	// );
	app.use(passport.initialize());
	app.use(passport.session());
	await app.listen(ConfigService.envConfig.port);
}
bootstrap();
