import { Server } from "http";
import { bootstrap } from "./infrastructure/bootstrapping";
import { container } from "./infrastructure/utils/ioc_container";
import { referenceDataIoCModule } from "./infrastructure/config/inversify.config";
import config from "./infrastructure/config/env";
import { App } from "./infrastructure/bootstrapping/loaders/express";
import { TYPES } from "./domain/constants/types";
import logger from "./infrastructure/bootstrapping/loaders/logger";

export const startServer = async (): Promise<Server> => {
    const app = await bootstrap({
        container,
        connStr: config.mongoDbConnection,
        containerModules: [referenceDataIoCModule]
    });
    // Run express server
    return app.listen(config.port, err => {
        if (err) {
            logger.error(err);
            process.exit(1);
            return;
        }
        container.bind<App>(TYPES.App).toConstantValue(app);
        logger.info(`✔️  Server listening on port: ${config.port}`);
    });
};

// Start server if it's not already running
if (!module.parent) startServer();
