import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { BaseMiddleware } from "inversify-express-utils";
import { config } from "../../../infrastructure/config";
import { provideSingleton } from "../../../infrastructure/config/ioc";
import { isIdValid } from "../../../infrastructure/utils/server_utils";
import { X_TENANT_ID } from "../../constants/header_constants";
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
        if (req.url.toLowerCase().startsWith("/api-docs")) return next();

        const isPublicUrl = req.url
            .toLowerCase()
            .startsWith(`${config.api.prefix}/tenants`.toLocaleLowerCase());

        if (isPublicUrl) return next();

        const tenantId = req.headers[X_TENANT_ID.toLocaleLowerCase()];

        if (!tenantId && !isPublicUrl)
            return res
                .status(httpStatus.BAD_REQUEST)
                .end(`${X_TENANT_ID} header is missing`);

        if (!isIdValid(tenantId as string))
            return next(
                new HttpError(
                    httpStatus.BAD_REQUEST,
                    `Invalid header ${X_TENANT_ID} value`
                )
            );

        next();
    }
}

export function exceptionLoggerMiddleware(
    error: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) {
    // const log = iocContainer.get<ILoggerService>(TYPES.LoggerService);

    // log.error(`
    // ----------------------------------
    // EXCEPTION MIDDLEWARE
    // HTTP ${req.method} ${req.url}
    // ${error.message}
    // ----------------------------------
    // `);

    if (error instanceof HttpError) {
        return res
            .status(error.status)
            .json({ ...error, message: error.message });
    }

    error =
        config.env === "development" || config.env === "test"
            ? new HttpError(httpStatus.INTERNAL_SERVER_ERROR, error.message)
            : new HttpError(httpStatus.INTERNAL_SERVER_ERROR);

    res.status(httpStatus.INTERNAL_SERVER_ERROR).json(error);
}
