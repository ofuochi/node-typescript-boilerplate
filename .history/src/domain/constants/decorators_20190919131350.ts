import { inject } from "inversify";

import { TYPES } from "./types";

export const dbClient = inject(TYPES.DbClient);
export const movieRepository = inject(TYPES.MovieRepository);
export const actorRepository = inject(TYPES.ActorRepository);
export const directorRepository = inject(TYPES.DirectorRepository);
export const userRepository = inject(TYPES.UserRepository);

export const autService = inject(TYPES.AuthService);
export const loggerService = inject(TYPES.LoggerService);
export const mailService = inject(TYPES.MailService);
export const searchService = inject(TYPES.SearchService);
