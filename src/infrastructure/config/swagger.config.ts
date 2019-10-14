import {
    generateRoutes,
    generateSwaggerSpec,
    RoutesConfig,
    SwaggerConfig
} from "tsoa";
import { config } from "./index";
import { X_TENANT_ID } from "../../ui/constants/header_constants";

const basePath = config.api.prefix;
const entryFile = "./src/index.ts";
const protocol =
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
        ? "http"
        : "https";
export const swaggerGen = async () => {
    const swaggerOptions: SwaggerConfig = {
        basePath,
        entryFile,
        securityDefinitions: {
            jwt: {
                type: "basic",
                description: "Authentication"
            },
            [X_TENANT_ID]: {
                type: "apiKey",
                in: "header",
                name: X_TENANT_ID,
                description: "Tenant ID"
            }
        },
        noImplicitAdditionalProperties: "throw-on-extras",
        host: process.env.HOST,
        description: "Enterprise NodeJs/Typescript API boilerplate",
        version: "1.0.0",
        name: "node-typescript-boilerplate",
        specVersion: 3,
        schemes: [protocol],
        tags: [
            {
                name: "Foos",
                description: "Operations about foos"
            }
        ],
        outputDirectory: "./",
        controllerPathGlobs: ["./src/ui/api/controllers/*.ts"]
    };

    const routeOptions: RoutesConfig = {
        basePath,
        entryFile,
        middleware: "express",
        authenticationModule: "./src/ui/api/middleware/auth_middleware",
        iocModule: "./src/infrastructure/config/ioc",
        routesDir: "./src/ui/api",
        controllerPathGlobs: ["./src/ui/api/controllers/*.ts"]
    };

    await generateSwaggerSpec(swaggerOptions, routeOptions);

    await generateRoutes(routeOptions, swaggerOptions);
};
