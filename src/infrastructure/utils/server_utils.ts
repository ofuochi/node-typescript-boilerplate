import { Server } from "http";
import { Types } from "mongoose";
import { TYPES } from "../../domain/constants/types";
import { App } from "../bootstrapping/loaders/express";
import { winstonLoggerInstance as log } from "../bootstrapping/loaders/logger";
import { config } from "../config";
import { iocContainer } from "../config/ioc";

export function exitProcess(error: any): void {
    log.error(`❌  ${error}`);
    process.exit(1);
}
export function startAppServer(app: App, serverPort?: number): Server {
    const port = serverPort || config.port;
    return app.listen(port, (error: any) => {
        if (error) exitProcess(error);
        iocContainer.bind<App>(TYPES.App).toConstantValue(app);
    });
}
export function isIdValid(id: string): boolean {
    return Types.ObjectId.isValid(id);
}
