import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
	imports: [UserModule],
	providers: [AccountService],
	controllers: [AccountController]
})
export class AccountModule {}
