import express from "express";
import httpStatus from "http-status-codes";

import { TYPES } from "../../domain/constants/types";
import { ILoggerService } from "../../domain/interfaces/services";
import { CurrentUser } from "../../domain/utils/globals";
import { getCurrentTenant } from "../helpers/tenant_helpers";
import { container } from "../utils/ioc_container";
import config from "../config";

export async function reqMiddleware(
    req: express.Request,
    res: express.Response,
    next: () => void
) {
    req.tenantId = req.header("X-Tenant-Id") as string;

    if (
        !req.tenantId &&
        !req.url
            .toLowerCase()
            .startsWith(`${config.api.prefix}/tenants`.toLocaleLowerCase())
    ) {
        return res
            .status(httpStatus.BAD_REQUEST)
            .end("x-tenant-id header is missing");
    } else if (
        !req.url
            .toLowerCase()
            .startsWith(`${config.api.prefix}/tenants`.toLocaleLowerCase())
    ) {
        const tenant = await getCurrentTenant(req.tenantId);
        global.currentUser = CurrentUser.createInstance(tenant);
    }

    const log = container.get<ILoggerService>(TYPES.LoggerService);
    log.info(`
    ----------------------------------
    REQUEST MIDDLEWARE
    HTTP ${req.method} ${req.url}
    ----------------------------------
    `);
    next();
}

export function exceptionLoggerMiddleware(
    error: Error,
    req: express.Request,
    res: express.Response,
    _next: () => void
) {
    const log = container.get<ILoggerService>(TYPES.LoggerService);

    // Log exception
    log.error(`
    ----------------------------------
    EXCEPTION MIDDLEWARE
    HTTP ${req.method} ${req.url}
    ${error.message}
    ${error.stack}
    ----------------------------------
    `);

    // Hide stack from client for security reasons
    const e = { error: "Internal server error" };
    res.status(500).json(e);
}
