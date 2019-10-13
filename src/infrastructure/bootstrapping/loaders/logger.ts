import winston from "winston";
import { config } from "../../config";

const transports = [];
if (process.env.NODE_ENV !== "development" && process.env.NODE_ENV !== "test") {
    transports.push(new winston.transports.Console());
} else {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.cli(),
                winston.format.splat()
            )
        })
    );
}

export const winstonLoggerInstance = winston.createLogger({
    level: config.logs.level,
    levels: winston.config.npm.levels,
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss"
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json({ space: -1 })
    ),
    transports
});
export type IWinstonLogger = winston.Logger;
