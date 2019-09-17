import winston from "winston";
import { injectable } from "inversify";

import { ILoggerService } from "../interfaces/services";
import config from "../../config";

@injectable()
export default class LoggerService implements ILoggerService {
    private readonly _logClient: winston.Logger;
    constructor() {
        this._logClient = this.createLoggerInstance();
    }
    silly(message: string) {
        this._logClient.silly(message);
    }
    error(message: string) {
        this._logClient.error(message);
    }
    info(message: string) {
        this._logClient.info(message);
    }
    debug(message: string) {
        this._logClient.debug(message);
    }
    warn(message: string) {
        this._logClient.warn(message);
    }
    private setupTransports() {
        const transports = [];
        if (config.env !== "development")
            transports.push(new winston.transports.Console());
        else
            transports.push(
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.cli(),
                        winston.format.splat()
                    )
                })
            );
        return transports;
    }
    private createLoggerInstance() {
        const transports = this.setupTransports();
        return winston.createLogger({
            level: config.logs.level,
            levels: winston.config.npm.levels,
            format: winston.format.combine(
                winston.format.timestamp({
                    format: "YYYY-MM-DD HH:mm:ss"
                }),
                winston.format.errors({ stack: true }),
                winston.format.splat(),
                winston.format.json()
            ),
            transports
        });
    }
}
