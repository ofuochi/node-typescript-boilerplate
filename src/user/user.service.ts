import {
	Injectable,
	ConflictException,
	NotFoundException
} from "@nestjs/common";

import { hashPassword } from "../shared/utils/pwHash";
import { UserRepository } from "./repository/user.repository";
import { User } from "./user.entity";
import { UserDto } from "./dto/UserResponse";

@Injectable()
export class UserService {
	constructor(private readonly _userRepository: UserRepository) {}
	async deleteById(id: string) {
		await this._userRepository.deleteById(id);
	}
	async update(input: UserDto) {
		const user = await this._userRepository.findById(input.id);
		if (!user)
			throw new NotFoundException(`Tenant with ID ${input.id} not found`);
		user.update(input);
		if (input.isActive) user.activate();
		else user.deactivate();
		await this._userRepository.insertOrUpdate(user);
	}
	pagedGetAll({
		limit = 0,
		skip = 0,
		search
	}: {
		limit?: number;
		skip?: number;
		search?: string;
	}): Promise<{ totalCount: number; items: User[] }> {
		return this._userRepository.pagedFindAll({ limit, skip, search });
	}

	async createUser(dto: {
		firstName: string;
		lastName: string;
		email: string;
		username: string;
		password: string;
	}): Promise<User> {
		let newUser = await this._userRepository.findOneByQuery({
			$or: [{ email: dto.email }, { username: dto.username }]
		} as object);

		if (newUser)
			throw new ConflictException(
				`User with the given email or username already exists`
			);

		dto.password = await hashPassword(dto.password);

		return this._userRepository.insertOrUpdate(User.createInstance(dto));
	}
	async getById(id: string): Promise<User> {
		return this._userRepository.findById(id);
	}
}
