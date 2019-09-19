import winston from "winston";
import { injectable } from "inversify";

import { ILoggerService } from "../interfaces/services";
import logger from "../../infrastructure/bootstrapping/loaders/logger";

@injectable()
export default class LoggerService implements ILoggerService {
    private readonly _logClient: winston.Logger;
    constructor() {
        this._logClient = logger;
    }
    silly = (message: string, meta?: any): void => {
        this._logClient.silly(message, meta);
    };
    error = (message: string, meta?: any): void => {
        this._logClient.error(message, meta);
    };
    info = (message: string, meta?: any): void => {
        this._logClient.info(message, meta);
    };
    debug = (message: string, meta?: any): void => {
        this._logClient.debug(message, meta);
    };
    warn = (message: string, meta?: any): void => {
        this._logClient.warn(message, meta);
    };
}
