import { Container, ContainerModule } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
// import { makeLoggerMiddleware } from "inversify-logger-middleware";

import bodyParser from "body-parser";
import helmet from "helmet";
import { Server } from "http";

import {
    reqMiddleware,
    exceptionLoggerMiddleware
} from "../middleware/interceptor_middleware";
import { DbClient, getDatabaseClient } from "../db/db_client";
import { TYPES } from "../../domain/constants/types";

export async function bootstrap({
    container,
    appPort,
    dbHost,
    dbName,
    containerModules = []
}: {
    container: Container;
    appPort: number;
    dbHost: string;
    dbName: string;
    containerModules?: ContainerModule[];
}): Promise<Server> {
    if (container.isBound(TYPES.Server) === false) {
        // container.applyMiddleware(makeLoggerMiddleware());
        const dbClient = await getDatabaseClient(dbHost, dbName);
        container.bind<DbClient>(TYPES.DbClient).toConstantValue(dbClient);
        container.load(...containerModules);

        // Configure express server
        const server = new InversifyExpressServer(container);

        server.setConfig(app => {
            // Disable default cache
            app.set("etag", false);

            // Configure requests body parsing
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(bodyParser.json());

            // Adds some security defaults
            app.use(helmet());

            // Log all requests that hit the server
            app.use(reqMiddleware);
        });

        server.setErrorConfig(app => {
            // Catch and log all exceptions
            app.use(exceptionLoggerMiddleware);
        });

        const app = server.build();

        // Run express server

        const appServer = app.listen(appPort, () => {
            console.log(`Application listening on port ${appPort}...`);
        });

        container.bind<Server>(TYPES.Server).toConstantValue(appServer);
        return appServer;
    } else {
        return container.get<Server>(TYPES.Server);
    }
}
