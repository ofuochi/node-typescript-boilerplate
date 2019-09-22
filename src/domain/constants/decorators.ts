import { inject } from "inversify";

import { TYPES } from "./types";

export const dbClient = inject(TYPES.DbClient);

export const tenantRepository = inject(TYPES.TenantRepository);
export const userRepository = inject(TYPES.UserRepository);

export const authService = inject(TYPES.AuthService);
export const loggerService = inject(TYPES.LoggerService);
export const mailService = inject(TYPES.MailService);

export const eventDispatcher = inject(TYPES.EventDispatcher);
