import "reflect-metadata";
import { Server } from "http";
import dotenv from "dotenv";
import { bootstrap } from "./infrastructure/bootstrapping/bootstrap";
import { container } from "./infrastructure/utils/ioc_container";
import { referenceDataIoCModule } from "./config/inversify.config";

dotenv.config();

export const startServer = async (): Promise<Server> => {
    return await bootstrap({
        container,
        appPort: parseInt(process.env.APP_PORT || "3000"),
        dbHost: process.env.DB_HOST || "localhost",
        dbName: process.env.DB_NAME || "node-typescript-boilerplate",
        containerModules: [referenceDataIoCModule]
    });
};

// Start server if it's not already running
if (!module.parent) startServer();
