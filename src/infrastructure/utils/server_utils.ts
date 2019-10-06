import { Server } from "http";

import { TYPES } from "../../domain/constants/types";
import { App } from "../bootstrapping/loaders/express";
import { winstonLoggerInstance } from "../bootstrapping/loaders/logger";
import { container } from "./ioc_container";
import { config } from "../config";

export function exitProcess(error: any): void {
    winstonLoggerInstance.error(`❌  ${error}`);
    process.exit(1);
}
export function startAppServer(app: App, serverPort?: number): Server {
    const port = serverPort || config.port;
    return app.listen(port, (error: any) => {
        if (error) exitProcess(error);
        container.bind<App>(TYPES.App).toConstantValue(app);
        winstonLoggerInstance.info(`✔️  Server listening on port: ${port}`);
    });
}
