import { TypegooseModule } from 'nestjs-typegoose';

import { Module } from '@nestjs/common';

import { TempPwResetRepository } from '../db/repos/pw_reset.repo';
import { TempPasswordReset } from '../entities/pw_reset.entity';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
	imports: [TypegooseModule.forFeature([User, TempPasswordReset])],
	exports: [UserService, UserRepository, TempPwResetRepository],
	providers: [UserService, UserRepository, TempPwResetRepository],
	controllers: [UserController]
})
export class UserModule {}
