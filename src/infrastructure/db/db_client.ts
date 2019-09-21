import mongoose from "mongoose";

import winstonLoggerInstance from "../bootstrapping/loaders/logger";

export type DbClient = mongoose.Mongoose;
export async function getDatabaseClient(connStr: string) {
    return new Promise<DbClient>((resolve, reject) => {
        mongoose.connect(connStr, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        });
        const db = mongoose.connection;
        db.on("error", (e: Error) => {
            winstonLoggerInstance.error("❌ Db connection error:", e);
            reject(e);
        });
        db.once("open", () => {
            winstonLoggerInstance.info(`✔️  Db connection successful`);
            resolve(mongoose);
        });
    });
}
