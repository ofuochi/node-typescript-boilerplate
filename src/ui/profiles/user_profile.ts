import { MappingProfileBase } from "automapper-nartc";
import { UserDto } from "../models/user_dto";
import { User } from "../../domain/model/user";

export class UserProfile extends MappingProfileBase {
    constructor() {
        super();
    }

    configure(): void {
        this.createMap(User, UserDto).forMember("id", options =>
            options.mapFrom(user => user.id.toString())
        );
    }
}
