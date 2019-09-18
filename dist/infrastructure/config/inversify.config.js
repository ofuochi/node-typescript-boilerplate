"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
// Interfaces & Types
const types_1 = require("../../domain/constants/types");
// Controllers
require("../../ui/api/controllers/movie_controller");
require("../../ui/api/controllers/director_controller");
require("../../ui/api/controllers/actor_controller");
require("../../ui/api/controllers/secure_controller");
require("../../ui/api/controllers/search_controller");
// Repositories
const movie_repository_1 = require("../../infrastructure/db/repositories/movie_repository");
const director_repository_1 = require("../../infrastructure/db/repositories/director_repository");
const user_repository_1 = require("../../infrastructure/db/repositories/user_repository");
const actor_repository_1 = require("../../infrastructure/db/repositories/actor_repository");
const search_service_1 = __importDefault(require("../../domain/services/search_service"));
const mail_service_1 = __importDefault(require("../../infrastructure/services/mail_service"));
const log_service_1 = __importDefault(require("./../../domain/services/log_service"));
const agenda_1 = __importDefault(require("./loaders/agenda"));
exports.referenceDataIoCModule = new inversify_1.ContainerModule(bind => {
    // Repositories
    bind(types_1.TYPES.MovieRepository)
        .to(movie_repository_1.MovieRepository)
        .inSingletonScope();
    bind(types_1.TYPES.DirectorRepository)
        .to(director_repository_1.DirectorRepository)
        .inSingletonScope();
    bind(types_1.TYPES.ActorRepository)
        .to(actor_repository_1.ActorRepository)
        .inSingletonScope();
    bind(types_1.TYPES.UserRepository)
        .to(user_repository_1.UserRepository)
        .inSingletonScope();
    // Services
    bind(types_1.TYPES.SearchService)
        .to(search_service_1.default)
        .inSingletonScope();
    bind(types_1.TYPES.MailService)
        .to(mail_service_1.default)
        .inSingletonScope();
    bind(types_1.TYPES.LoggerService)
        .to(log_service_1.default)
        .inSingletonScope();
    // Third Party Services
    bind("Agenda").toConstantValue(agenda_1.default());
});
//# sourceMappingURL=inversify.config.js.map