import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";

import config from "../../../infrastructure/config";
import HttpError from "../../error";
import { TYPES } from "../../../domain/constants/types";
import { ILoggerService } from "../../../domain/interfaces/services";
import { getCurrentTenant } from "../../../infrastructure/helpers/tenant_helpers";
import { container } from "../../../infrastructure/utils/ioc_container";

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
        const tenant = await getCurrentTenant(req.tenantId as string);
        if (!container.isBound(TYPES.TenantId))
            container.bind<string>(TYPES.TenantId).toConstantValue(tenant.id);

        next();
    }
}

export function exceptionLoggerMiddleware(
    error: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) {
    const log = container.get<ILoggerService>(TYPES.LoggerService);

    log.error(`
    ----------------------------------
    EXCEPTION MIDDLEWARE
    HTTP ${req.method} ${req.url}
    ${error.message}
    ----------------------------------
    `);

    //if (typeof error === "number") error = new HttpError(error); // next(404)

    if (error instanceof HttpError) return res.status(error.status).send(error);
    error =
        config.env === "development" || config.env === "test"
            ? new HttpError(httpStatus.INTERNAL_SERVER_ERROR, error.message)
            : new HttpError(httpStatus.INTERNAL_SERVER_ERROR);

    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
}
