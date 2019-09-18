import { ContainerModule } from "inversify";

// Interfaces & Types
import { TYPES } from "../../domain/constants/types";
import {
    IMovieRepository,
    IActorRepository,
    IDirectorRepository,
    IUserRepository
} from "../../domain/interfaces/repositories";

// Controllers
import "../../ui/api/controllers/movie_controller";
import "../../ui/api/controllers/director_controller";
import "../../ui/api/controllers/actor_controller";
import "../../ui/api/controllers/secure_controller";
import "../../ui/api/controllers/search_controller";

// Repositories
import { MovieRepository } from "../../infrastructure/db/repositories/movie_repository";
import { DirectorRepository } from "../../infrastructure/db/repositories/director_repository";
import { UserRepository } from "../../infrastructure/db/repositories/user_repository";
import { ActorRepository } from "../../infrastructure/db/repositories/actor_repository";

// Services
import {
    ISearchService,
    IMailService,
    ILoggerService
} from "../../domain/interfaces/services";
import SearchService from "../../domain/services/search_service";
import MailService from "../../infrastructure/services/mail_service";
import LoggerService from "./../../domain/services/log_service";

export const referenceDataIoCModule = new ContainerModule(bind => {
    // Repositories
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
});
