import { Server } from "http";

import { bootstrap } from "./infrastructure/bootstrapping";
import { container } from "./infrastructure/utils/ioc_container";
import { referenceDataIoCModule } from "./infrastructure/config/inversify.config";
import { App } from "./infrastructure/bootstrapping/loaders/express";
import { TYPES } from "./domain/constants/types";
import config from "./infrastructure/config/env";
import logger from "./infrastructure/bootstrapping/loaders/logger";

export const startServer = async (): Promise<Server> => {
    try {
        const app = await bootstrap({
            container,
            connStr: config.mongoDbConnection,
            containerModules: [referenceDataIoCModule]
        });
        return app.listen(config.port, error => {
            if (error) exitProcess(error);
            container.bind<App>(TYPES.App).toConstantValue(app);
            logger.info(`✔️  Server listening on port: ${config.port}`);
        });
    } catch (error) {
        exitProcess(error);
        throw error;
    }
    // Run express server
};

function exitProcess(error: any): void {
    logger.error(`❌  ${error}`);
    process.exit(1);
}

// Start server if it's not already running
if (!module.parent) startServer();
