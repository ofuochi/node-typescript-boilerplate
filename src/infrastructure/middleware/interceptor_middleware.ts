import express from "express";
import httpStatus from "http-status-codes";

import { TYPES } from "../../domain/constants/types";
import { ILoggerService } from "../../domain/interfaces/services";
import { container } from "../utils/ioc_container";
import { CurrentTenant } from "../../domain/utils/currentTenant";

export function reqMiddleware(
    req: express.Request,
    res: express.Response,
    next: () => void
) {
    const log = container.get<ILoggerService>(TYPES.LoggerService);
    req.tenant = req.headers["x-tenant-id"] as string;

    if (!req.tenant)
        return res
            .status(httpStatus.BAD_REQUEST)
            .end("x-tenant-id header is missing");

    global.currentTenant = new CurrentTenant(req.tenant);

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
