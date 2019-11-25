import { SetMetadata } from "@nestjs/common";

import { UserRole } from "../user/user.entity";

export const Roles = (...roles: UserRole[]) => SetMetadata(UserRole, roles);
