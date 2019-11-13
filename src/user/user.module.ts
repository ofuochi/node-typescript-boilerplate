import { Module } from "@nestjs/common";
import { TypegooseModule } from "nestjs-typegoose";
import { UserRepository } from "./repository/user.repository";
import { UserController } from "./user.controller";
import { User } from "./user.entity";
import { UserService } from "./user.service";

@Module({
	imports: [TypegooseModule.forFeature([User])],
	exports: [UserService, UserRepository],
	providers: [UserService, UserRepository],
	controllers: [UserController]
})
export class UserModule {}
