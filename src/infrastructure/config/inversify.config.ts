import { EventDispatcher } from "event-dispatch";
import { ContainerModule } from "inversify";

// Interfaces & Types
import { TYPES } from "../../domain/constants/types";
import {
    ITenantRepository,
    IUserRepository
} from "../../domain/interfaces/repositories";
import { ILoggerService, IMailService } from "../../domain/interfaces/services";
import { IAuthService } from "../../ui/interfaces/auth_service";

// Service implementations
import LoggerService from "../../domain/services/logger_service";
import MailService from "../../infrastructure/services/mail_service";
import AuthService from "../../ui/services/auth_service";

// Repositories implementations
import { UserRepository } from "../../infrastructure/db/repositories/user_repository";
import { TenantRepository } from "../db/repositories/tenant_repository";

// Controllers
import "../../ui/api/controllers/auth_controller";
import "../../ui/api/controllers/secure_controller";
import "../../ui/api/controllers/tenant_controller";

export const referenceDataIoCModule = new ContainerModule(bind => {
    // Repositories
    bind<ITenantRepository>(TYPES.TenantRepository).to(TenantRepository);

    bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

    // Services
    bind<IMailService>(TYPES.MailService).to(MailService);

    bind<IAuthService>(TYPES.AuthService).to(AuthService);

    bind<ILoggerService>(TYPES.LoggerService).to(LoggerService);

    bind<EventDispatcher>(TYPES.EventDispatcher).toConstantValue(
        new EventDispatcher()
    );
});
