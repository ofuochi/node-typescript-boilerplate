import { injectable } from "inversify";

import winstonLoggerInstance, {
    IWinstonLogger
} from "../../infrastructure/bootstrapping/loaders/logger";
import { ILoggerService } from "../interfaces/services";

@injectable()
export default class LoggerService implements ILoggerService {
    private readonly _loggerInstance: IWinstonLogger = winstonLoggerInstance;

    silly(message: string, meta?: any): void {
        this._loggerInstance.silly(message, meta);
    }
    error(message: string, meta?: any): void {
        this._loggerInstance.error(message, meta);
    }
    info(message: string, meta?: any): void {
        this._loggerInstance.info(message, meta);
    }
    debug(message: string, meta?: any): void {
        this._loggerInstance.debug(message, meta);
    }
    warn(message: string, meta?: any): void {
        this._loggerInstance.warn(message, meta);
    }
}
