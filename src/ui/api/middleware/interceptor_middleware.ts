import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { BaseMiddleware } from "inversify-express-utils";
import { config } from "../../../infrastructure/config";
import { provideSingleton } from "../../../infrastructure/config/ioc";
import { HttpError } from "../../error";

@provideSingleton(RequestMiddleware)
export class RequestMiddleware extends BaseMiddleware {
    async handler(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        // const log = iocContainer.get<ILoggerService>(LoggerService);
        // log.info(`
        //     ----------------------------------
        //     REQUEST MIDDLEWARE
        //     HTTP ${req.method} ${req.url}
        //     ----------------------------------
        //     `);
        next();
    }
}

export function exceptionLoggerMiddleware(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    // const log = iocContainer.get<ILoggerService>(LoggerService);

    // log.error(`
    // ----------------------------------
    // EXCEPTION MIDDLEWARE
    // HTTP ${req.method} ${req.url}
    // ${error.message}
    // ----------------------------------
    // `);

    if (error instanceof HttpError) {
        //   sendHttpErrorModule(req, res, next);
        return res
            .status(error.status)
            .json({ ...error, message: error.message });
    }

    error =
        config.env === "development" || config.env === "test"
            ? new HttpError(httpStatus.INTERNAL_SERVER_ERROR, error.message)
            : new HttpError(httpStatus.INTERNAL_SERVER_ERROR);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        ...error,
        message: error.message
    });
}
