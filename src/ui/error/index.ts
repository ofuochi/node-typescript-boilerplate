import http from "http";

/**
 * @export
 * @class HttpError
 * @extends {Error}
 */
export class HttpError extends Error {
    readonly status: number;

    constructor(status?: number, message?: string, name?: string) {
        super(message);
        Error.captureStackTrace(this, this.constructor);

        this.status = status || 500;
        this.name = name || this.name;
        this.message =
            message ||
            http.STATUS_CODES[this.status] ||
            "An error occurred during the request.";
    }
}
