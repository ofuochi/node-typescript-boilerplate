import { TypegooseModule } from 'nestjs-typegoose';

import { Module } from '@nestjs/common';

import { Tenant } from '../tenant/tenant.entity';
import { User } from '../user/user.entity';
import { DbService } from './db.service';

@Module({
  imports: [TypegooseModule.forFeature([Tenant, User])],
  exports: [DbService],
  providers: [DbService],
})
export class DbModule {}
