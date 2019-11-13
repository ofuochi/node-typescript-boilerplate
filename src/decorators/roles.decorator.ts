import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/user/user.entity";

export const Roles = (...roles: UserRole[]) => SetMetadata("roles", roles);
