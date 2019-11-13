import { Module } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { UserModule } from "../user/user.module";

@Module({
	imports: [UserModule],
	providers: [AccountService],
	controllers: [AccountController]
})
export class AccountModule {}
