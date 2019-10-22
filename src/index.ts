import "reflect-metadata";
import { bootstrap } from "./infrastructure/bootstrapping";
import { winstonLoggerInstance } from "./infrastructure/bootstrapping/loaders/logger";
import { config } from "./infrastructure/config";
import { referenceDataIoCModule } from "./infrastructure/config/inversify.config";
import { iocContainer } from "./infrastructure/config/ioc";
import {
    exitProcess,
    startAppServer
} from "./infrastructure/utils/server_utils";

export async function startServer(connStr: string, port: number) {
    try {
        const app = await bootstrap({
            iocContainer,
            connStr,
            containerModules: [referenceDataIoCModule]
        });
        startAppServer(app, port);
        winstonLoggerInstance.info(`✔️  Server listening on port: ${port}\n`);
    } catch (error) {
        exitProcess(error);
        throw error;
    }
}

startServer(config.mongoDbConnection, config.port);
