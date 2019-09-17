"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const types_1 = require("./types");
exports.dbClient = inversify_1.inject(types_1.TYPES.DbClient);
exports.movieRepository = inversify_1.inject(types_1.TYPES.MovieRepository);
exports.actorRepository = inversify_1.inject(types_1.TYPES.ActorRepository);
exports.directorRepository = inversify_1.inject(types_1.TYPES.DirectorRepository);
exports.userRepository = inversify_1.inject(types_1.TYPES.UserRepository);
exports.autService = inversify_1.inject(types_1.TYPES.AuthService);
exports.loggerService = inversify_1.inject(types_1.TYPES.LoggerService);
exports.mailService = inversify_1.inject(types_1.TYPES.MailService);
exports.searchService = inversify_1.inject(types_1.TYPES.SearchService);
//# sourceMappingURL=decorators.js.map