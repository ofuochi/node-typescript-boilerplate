import { Injectable } from "@nestjs/common";

import { hashPassword } from "../shared/utils/pwHash";
import { UserRepository } from "./repository/user.repository";
import { User } from "./user.entity";

@Injectable()
export class UserService {
	constructor(private readonly _userRepository: UserRepository) {}

	async createUser(user: {
		firstName: string;
		lastName: string;
		email: string;
		username: string;
		password: string;
	}) {
		user.password = await hashPassword(user.password);
		const newUser = User.createInstance(user);
		return this._userRepository.insertOrUpdate(newUser);
	}
}
