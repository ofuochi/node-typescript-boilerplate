import "reflect-metadata";

import Agenda from "agenda";
import { Container, ContainerModule } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";

import { TYPES } from "../../domain/constants/types";
import { exceptionLoggerMiddleware } from "../../ui/api/middleware/interceptor_middleware";
import { config } from "../config";
import { DbClient, getDatabaseClient } from "../db/db_client";
import { getAgendaInstance } from "./loaders/agenda_loader";
import { expressLoader, App } from "./loaders/express";
import { Jobs } from "./loaders/jobs";
import { winstonLoggerInstance } from "./loaders/logger";
import "./loaders/events";

export async function bootstrap({
    container,
    connStr,
    containerModules = []
}: {
    container: Container;
    connStr: string;
    containerModules?: ContainerModule[];
}): Promise<App> {
    if (container.isBound(TYPES.App) === true)
        return container.get<App>(TYPES.App);

    // container.applyMiddleware(makeLoggerMiddleware());
    const dbClient = await getDatabaseClient(connStr);
    container.bind<DbClient>(TYPES.DbClient).toConstantValue(dbClient);
    container
        .bind<Agenda>(TYPES.Agenda)
        .toConstantValue(getAgendaInstance(connStr));

    container.load(...containerModules);
    winstonLoggerInstance.info("✔️  Dependency Injector loaded");

    Jobs.forEach(async job => job(container.get<Agenda>(TYPES.Agenda)));
    winstonLoggerInstance.info("✔️  Jobs loaded");

    // Configure express server using inversify IoC
    const server = new InversifyExpressServer(container, null, {
        rootPath: config.api.prefix
    });

    server.setConfig(app => expressLoader(app));
    winstonLoggerInstance.info("✔️  Express loaded");

    server.setErrorConfig(app => {
        // Catch and log all exceptions
        app.use(exceptionLoggerMiddleware);
    });
    winstonLoggerInstance.info(`✔️  Environment: ${process.env.NODE_ENV}`);

    return server.build();
}
