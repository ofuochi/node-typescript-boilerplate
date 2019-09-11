import IEntityDataMapper from "../../core/services/interfaces/IEntityDataMapper";
import { UserDto } from "../../models/DTO/user.dto";
import User from "../../core/entities/User";

export default class UserDataMapper
    implements IEntityDataMapper<UserDto, User> {
    toDto(entity: User): UserDto {
        return {
            _id: entity.id,
            email: entity.email,
            firstName: entity.firstName,
            lastName: entity.lastName,
            username: entity.username
        };
    }
    toDalEntity(dto: UserDto): User {
        return User.createInstance({
            username: dto.username,
            firstName: dto.firstName,
            lastName: dto.lastName,
            email: dto.email,
            tenantId: "tenantId"
        });
    }
}
