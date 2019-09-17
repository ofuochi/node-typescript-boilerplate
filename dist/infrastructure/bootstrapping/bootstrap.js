"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_express_utils_1 = require("inversify-express-utils");
// import { makeLoggerMiddleware } from "inversify-logger-middleware";
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const interceptor_middleware_1 = require("../middleware/interceptor_middleware");
const db_client_1 = require("../db/db_client");
const types_1 = require("../../domain/constants/types");
// Controllers
require("../../ui/api/controllers/movie_controller");
require("../../ui/api/controllers/director_controller");
require("../../ui/api/controllers/actor_controller");
require("../../ui/api/controllers/secure_controller");
require("../../ui/api/controllers/search_controller");
function bootstrap({ container, appPort, dbHost, dbName, containerModules = [] }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (container.isBound(types_1.TYPES.Server) === false) {
            // container.applyMiddleware(makeLoggerMiddleware());
            const dbClient = yield db_client_1.getDatabaseClient(dbHost, dbName);
            container.bind(types_1.TYPES.DbClient).toConstantValue(dbClient);
            container.load(...containerModules);
            // Configure express server
            const server = new inversify_express_utils_1.InversifyExpressServer(container);
            server.setConfig(app => {
                // Disable default cache
                app.set("etag", false);
                // Configure requests body parsing
                app.use(body_parser_1.default.urlencoded({ extended: true }));
                app.use(body_parser_1.default.json());
                // Adds some security defaults
                app.use(helmet_1.default());
                // Log all requests that hit the server
                app.use(interceptor_middleware_1.reqMiddleware);
            });
            server.setErrorConfig(app => {
                // Catch and log all exceptions
                app.use(interceptor_middleware_1.exceptionLoggerMiddleware);
            });
            const app = server.build();
            // Run express server
            const appServer = app.listen(appPort, () => {
                console.log(`Application listening on port ${appPort}...`);
            });
            container.bind(types_1.TYPES.Server).toConstantValue(appServer);
            return appServer;
        }
        else {
            return container.get(types_1.TYPES.Server);
        }
    });
}
exports.bootstrap = bootstrap;
//# sourceMappingURL=bootstrap.js.map