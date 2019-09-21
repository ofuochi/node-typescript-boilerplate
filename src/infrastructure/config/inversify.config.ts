import Agenda from "agenda";
import { EventDispatcher } from "event-dispatch";
import { ContainerModule } from "inversify";

// Interfaces & Types
import { TYPES } from "../../domain/constants/types";
import {
    IActorRepository,
    IDirectorRepository,
    IMovieRepository,
    ITenantRepository,
    IUserRepository
} from "../../domain/interfaces/repositories";
import {
    ILoggerService,
    IMailService,
    ISearchService
} from "../../domain/interfaces/services";

// Service implementations
import LoggerService from "../../domain/services/logger_service";
import SearchService from "../../domain/services/search_service";
import MailService from "../../infrastructure/services/mail_service";

// Repositories implementations
import { ActorRepository } from "../../infrastructure/db/repositories/actor_repository";
import { DirectorRepository } from "../../infrastructure/db/repositories/director_repository";
import { MovieRepository } from "../../infrastructure/db/repositories/movie_repository";
import { UserRepository } from "../../infrastructure/db/repositories/user_repository";
import { TenantRepository } from "../db/repositories/tenant_repository";

// Loaders
import agendaInstance from "../bootstrapping/loaders/agenda";

// Controllers
import "../../ui/api/controllers/actor_controller";
import "../../ui/api/controllers/director_controller";
import "../../ui/api/controllers/movie_controller";
import "../../ui/api/controllers/search_controller";
import "../../ui/api/controllers/secure_controller";
import "../../ui/api/controllers/tenant_controller";

export const referenceDataIoCModule = new ContainerModule(bind => {
    // Repositories
    bind<ITenantRepository>(TYPES.TenantRepository)
        .to(TenantRepository)
        .inSingletonScope();
    bind<IMovieRepository>(TYPES.MovieRepository)
        .to(MovieRepository)
        .inSingletonScope();

    bind<IDirectorRepository>(TYPES.DirectorRepository)
        .to(DirectorRepository)
        .inSingletonScope();

    bind<IActorRepository>(TYPES.ActorRepository)
        .to(ActorRepository)
        .inSingletonScope();

    bind<IUserRepository>(TYPES.UserRepository)
        .to(UserRepository)
        .inSingletonScope();

    // Services
    bind<ISearchService>(TYPES.SearchService)
        .to(SearchService)
        .inSingletonScope();
    bind<IMailService>(TYPES.MailService)
        .to(MailService)
        .inSingletonScope();

    bind<ILoggerService>(TYPES.LoggerService)
        .to(LoggerService)
        .inSingletonScope();

    bind<EventDispatcher>(TYPES.EventDispatcher).toConstantValue(
        new EventDispatcher()
    );

    bind<Agenda>(TYPES.Agenda).toConstantValue(agendaInstance);
});
