import express from "express";

import { TYPES } from "../../domain/constants/types";
import { container } from "../utils/ioc_container";
import { ILoggerService } from "../../domain/interfaces/services";

export function reqMiddleware(
    _req: express.Request,
    _res: express.Response,
    next: () => void
) {
    // const log = container.get<ILoggerService>(TYPES.LoggerService);
    // log.info(`
    // ----------------------------------
    // REQUEST MIDDLEWARE
    // HTTP ${req.method} ${req.url}
    // ----------------------------------
    // `);
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
