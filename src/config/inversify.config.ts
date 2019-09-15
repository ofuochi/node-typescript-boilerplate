import { ContainerModule } from "inversify";

// Interfaces & Types
import { TYPES } from "../domain/constants/types";
import {
	IMovieRepository,
	IActorRepository,
	IDirectorRepository,
	IAccountRepository
} from "../domain/interfaces/repositories";

import { ISearchService } from "../domain/interfaces/services";

// Controllers
import "../ui/api/controllers/movie_controller";
import "../ui/api/controllers/director_controller";
import "../ui/api/controllers/actor_controller";
import "../ui/api/controllers/secure_controller";
import "../ui/api/controllers/search_controller";

// Repositories
import { MovieRepository } from "../infrastructure/db/repositories/movie_repository";
import { DirectorRepository } from "../infrastructure/db/repositories/director_repository";
import { AccountRepository } from "../infrastructure/db/repositories/account_repository";
import { ActorRepository } from "../infrastructure/db/repositories/actor_repository";

// Services
import { SearchService } from "../domain/services/search_service";

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

	bind<IAccountRepository>(TYPES.AccountRepository)
		.to(AccountRepository)
		.inSingletonScope();

	// Services
	bind<ISearchService>(TYPES.SearchService)
		.to(SearchService)
		.inSingletonScope();
});
