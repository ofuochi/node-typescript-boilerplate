import Agenda from "agenda";
import { Container, ContainerModule, decorate, injectable } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { InversifyExpressServer } from "inversify-express-utils";
import { Controller } from "tsoa";
import { TYPES } from "../../domain/constants/types";
import { exceptionLoggerMiddleware } from "../../ui/api/middleware/interceptor_middleware";
import { RegisterRoutes } from "../../ui/api/routes";
import { config } from "../config";
import { swaggerGen } from "../config/swagger.config";
import { DbClient, getDatabaseClient } from "../db/db_client";
import { getAgendaInstance } from "./loaders/agenda_loader";
import "./loaders/events";
import { App, expressLoader } from "./loaders/express";
import { Jobs } from "./loaders/jobs";
import { winstonLoggerInstance as logger } from "./loaders/logger";

export async function bootstrap({
    iocContainer,
    connStr,
    containerModules = []
}: {
    iocContainer: Container;
    connStr: string;
    containerModules?: ContainerModule[];
}): Promise<App> {
    if (iocContainer.isBound(TYPES.App) === true)
        return iocContainer.get<App>(TYPES.App);

    // iocContainer.applyMiddleware(makeLoggerMiddleware());
    const dbClient = await getDatabaseClient(connStr);
    iocContainer.bind<DbClient>(TYPES.DbClient).toConstantValue(dbClient);
    iocContainer
        .bind<Agenda>(TYPES.Agenda)
        .toConstantValue(getAgendaInstance(connStr));
    decorate(injectable(), Controller);

    iocContainer.load(buildProviderModule());

    iocContainer.load(...containerModules);
    logger.info("✔️  Dependency Injector loaded");

    Jobs.forEach(async job => job(iocContainer.get<Agenda>(TYPES.Agenda)));
    logger.info("✔️  Jobs loaded");

    // Configure express server using inversify IoC
    const server = new InversifyExpressServer(iocContainer, null, {
        rootPath: config.api.prefix
    });

    logger.info("✔️  Generating swagger doc...");
    await swaggerGen();
    server.setConfig((app: App) => expressLoader(app));
    logger.info("✔️  Express loaded");

    server.setErrorConfig(app => {
        // Catch and log all exceptions
        app.use(exceptionLoggerMiddleware);
    });
    const app = server.build() as App;

    logger.info("✔️  Generating routes...");
    RegisterRoutes(app);

    logger.info(`✔️  Environment: ${process.env.NODE_ENV}`);
    return app;
}
