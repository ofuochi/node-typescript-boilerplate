import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { ConfigModule } from "../config/config.module";
import { MailService } from "../shared/services/mail.service";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { SessionSerializer } from "./session.serializer";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
	imports: [
		UserModule,
		ConfigModule,
		PassportModule.register({ session: true }),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: "2 days" }
		})
	],
	exports: [JwtStrategy],
	providers: [AuthService, JwtStrategy, SessionSerializer, MailService],
	controllers: [AuthController]
})
export class AuthModule {}
