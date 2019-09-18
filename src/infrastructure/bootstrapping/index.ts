import "reflect-metadata";
import { Container, ContainerModule } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";

import { exceptionLoggerMiddleware } from "../middleware/interceptor_middleware";
import { DbClient, getDatabaseClient } from "../db/db_client";
import { TYPES } from "../../domain/constants/types";
import logger from "./loaders/logger";
import getAgendaInstance from "./loaders/agenda";
import { Jobs } from "./loaders/jobs";
import expressLoader, { App } from "./loaders/express";

export async function bootstrap({
    container,
    connStr,
    containerModules = []
}: {
    container: Container;
    connStr: string;
    containerModules?: ContainerModule[];
}): Promise<App> {
    if (container.isBound(TYPES.App) === false) {
        // container.applyMiddleware(makeLoggerMiddleware());
        const dbClient = await getDatabaseClient(connStr);

        container.bind<DbClient>(TYPES.DbClient).toConstantValue(dbClient);
        container.load(...containerModules);
        logger.info("✔️  Dependency Injector loaded");

        await Jobs.sendWelcomeEmail(getAgendaInstance);
        logger.info("✔️  Jobs loaded");

        // Configure express server using inversify IoC
        const server = new InversifyExpressServer(container);

        server.setConfig(app => expressLoader(app));
        logger.info("✔️  Express loaded");

        server.setErrorConfig(app => {
            // Catch and log all exceptions
            app.use(exceptionLoggerMiddleware);
        });

        const app = server.build();

        return app;
    } else {
        return container.get<App>(TYPES.App);
    }
}
