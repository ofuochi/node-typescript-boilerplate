import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import mongoose from "mongoose";

import CurrentUser from "../../../domain/utils/globals";
import config from "../../../infrastructure/config";
import getCurrentTenant from "../../../infrastructure/helpers/tenant_helpers";
import HttpError from "../../error";

@injectable()
export class RequestMiddleware extends BaseMiddleware {
    async handler(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        req.tenantId = req.header("X-Tenant-Id");
        const isTenantUrl = req.url
            .toLowerCase()
            .startsWith(`${config.api.prefix}/tenants`.toLocaleLowerCase());

        if (!req.tenantId && !isTenantUrl)
            return res
                .status(httpStatus.BAD_REQUEST)
                .end("x-tenant-id header is missing");
        // const log = container.get<ILoggerService>(TYPES.LoggerService);
        // log.info(`
        // ----------------------------------
        // REQUEST MIDDLEWARE
        // HTTP ${req.method} ${req.url}
        // ----------------------------------
        // `);
        if (isTenantUrl) return next();
        if (!mongoose.Types.ObjectId.isValid(req.tenantId as string))
            return next(
                new HttpError(
                    httpStatus.BAD_REQUEST,
                    "Invalid header X-Tenant-Id value"
                )
            );

        const tenant = await getCurrentTenant(req.tenantId as string);
        global.currentUser = CurrentUser.createInstance(tenant);

        next();
    }
}

export function exceptionLoggerMiddleware(
    error: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) {
    // const log = container.get<ILoggerService>(TYPES.LoggerService);

    // log.error(`
    // ----------------------------------
    // EXCEPTION MIDDLEWARE
    // HTTP ${req.method} ${req.url}
    // ${error.message}
    // ----------------------------------
    // `);
    if (error instanceof HttpError) return res.status(error.status).send(error);
    error =
        config.env === "development" || config.env === "test"
            ? new HttpError(httpStatus.INTERNAL_SERVER_ERROR, error.message)
            : new HttpError(httpStatus.INTERNAL_SERVER_ERROR);

    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
}
