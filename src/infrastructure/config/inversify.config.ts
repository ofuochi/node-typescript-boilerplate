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
import { ITenantService } from "../../ui/interfaces/tenant_service";

// Service implementations
import { LoggerService } from "../services/logger_service";
import { MailService } from "../services/mail_service";
import { AuthService } from "../../ui/services/auth_service";
import { TenantService } from "../../ui/services/tenant_service";

// Repositories implementations
import { UserRepository } from "../db/repositories/user_repository";
import { TenantRepository } from "../db/repositories/tenant_repository";

// Controllers
import "../../ui/api/controllers/auth_controller";
import "../../ui/api/controllers/tenant_controller";

export const referenceDataIoCModule = new ContainerModule(bind => {
    // Repositories
    bind<ITenantRepository>(TYPES.TenantRepository)
        .to(TenantRepository)
        .inSingletonScope();

    bind<IUserRepository>(TYPES.UserRepository)
        .to(UserRepository)
        .inSingletonScope();

    // Services
    bind<IMailService>(TYPES.MailService)
        .to(MailService)
        .inSingletonScope();

    bind<IAuthService>(TYPES.AuthService)
        .to(AuthService)
        .inSingletonScope();

    bind<ILoggerService>(TYPES.LoggerService)
        .to(LoggerService)
        .inSingletonScope();

    bind<ITenantService>(TYPES.TenantService)
        .to(TenantService)
        .inSingletonScope();

    bind<EventDispatcher>(TYPES.EventDispatcher).toConstantValue(
        new EventDispatcher()
    );
});
