import "reflect-metadata";
import { Container, ContainerModule } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import cors from "cors";
import methodOverride from "method-override";

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
            app.get("/status", (_req, res) => {
                res.status(200).end();
            });
            app.head("/status", (_req, res) => {
                res.status(200).end();
            });

            // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
            // It shows the real origin IP in the heroku or Cloudwatch logs
            app.enable("trust proxy");

            // Enable Cross Origin Resource Sharing to all origins by default
            app.use(cors());

            // Some sauce that always add since 2014
            // "Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it."
            // Maybe not needed anymore ?
            app.use(methodOverride());

            // Disable default cache
            app.set("etag", false);

            // Configure requests body parsing
            app.use(
                bodyParser.urlencoded({
                    extended: true
                })
            );
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
