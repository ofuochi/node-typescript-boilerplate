import { bootstrap } from "./infrastructure/bootstrapping";
import config from "./infrastructure/config";
import { referenceDataIoCModule } from "./infrastructure/config/inversify.config";
import { container } from "./infrastructure/utils/ioc_container";
import {
    exitProcess,
    startAppServer
} from "./infrastructure/utils/server_utils";

export const startServer = async (connStr: string, port: number) => {
    try {
        const app = await bootstrap({
            container,
            connStr,
            containerModules: [referenceDataIoCModule]
        });
        startAppServer(app, port);
    } catch (error) {
        exitProcess(error);
        throw error;
    }
};

startServer(config.mongoDbConnection, config.port);
