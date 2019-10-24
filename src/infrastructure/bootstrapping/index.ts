import Agenda from "agenda";
import { Container, ContainerModule, decorate, injectable } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";
import { InversifyExpressServer } from "inversify-express-utils";
import swaggerUi from "swagger-ui-express";
import { Controller } from "tsoa";
import swaggerJsonDoc from "../../../swagger.json";
import { TYPES } from "../../core/domain/constants/types";
import { exceptionLoggerMiddleware } from "../../ui/api/middleware/interceptor_middleware";
import { RegisterRoutes } from "../../ui/api/routes";
import { config } from "../config";
import { swaggerGen } from "../config/swagger.config";
import {
    DbClient,
    getDatabaseClient,
    seedDefaultAdmin,
    seedDefaultTenant
} from "../db/db_client";
import { getAgendaInstance } from "./loaders/agenda_loader";
import "./loaders/events";
import { App, expressLoader } from "./loaders/express";
import { Jobs } from "./loaders/jobs";
import { winstonLoggerInstance as log } from "./loaders/logger";

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

    iocContainer.load(...containerModules);

    decorate(injectable(), Controller);
    iocContainer.load(buildProviderModule());
    log.info("✔️  Dependency Injector loaded");

    await seedDb();

    Jobs.forEach(async job => job(iocContainer.get<Agenda>(TYPES.Agenda)));
    log.info("✔️  Jobs loaded");

    // Configure express server using inversify IoC
    const server = new InversifyExpressServer(
        iocContainer,
        null,
        null,
        null,
        null,
        false
    );

    server.setConfig((app: App) => expressLoader(app));
    log.info("✔️  Express loaded");

    server.setErrorConfig(app => {
        // Catch and log all exceptions
        app.use(exceptionLoggerMiddleware);
    });
    const app = server.build() as App;
    await setupSwagger(app);
    log.info(`✔️  Environment: ${config.port}`);

    return app;
}
async function setupSwagger(app: App) {
    log.info("✔️  Generating routes...");
    RegisterRoutes(app);
    log.info("✔️  Generating swagger doc...");
    await swaggerGen();
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsonDoc));
}
async function seedDb() {
    log.info("✔️  Seeding DB...");
    const tenant = await seedDefaultTenant();
    await seedDefaultAdmin(tenant);
}
