"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function reqMiddleware(req, res, next) {
    console.log(`
    ----------------------------------
    REQUEST MIDDLEWARE
    HTTP ${req.method} ${req.url}
    ----------------------------------
    `);
    next();
}
exports.reqMiddleware = reqMiddleware;
function exceptionLoggerMiddleware(error, req, res, next) {
    // Log exception
    console.error(`
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
exports.exceptionLoggerMiddleware = exceptionLoggerMiddleware;
//# sourceMappingURL=interceptor_middleware.js.map