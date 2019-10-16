import {
    generateRoutes,
    generateSwaggerSpec,
    RoutesConfig,
    SwaggerConfig
} from "tsoa";
import { config } from "./index";
import {
    X_TENANT_ID,
    X_AUTH_TOKEN_KEY
} from "../../ui/constants/header_constants";

const basePath = config.api.prefix;
const entryFile = "./src/index.ts";
const controllers = "./src/ui/api/controllers/*.ts";
const protocol =
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
        ? "http"
        : "https";

export const swaggerGen = async () => {
    const swaggerOptions: SwaggerConfig = {
        basePath,
        entryFile,
        securityDefinitions: {
            [X_TENANT_ID]: {
                type: "apiKey",
                in: "header",
                name: X_TENANT_ID,
                description: "Tenant ID"
            },
            [X_AUTH_TOKEN_KEY]: {
                type: "apiKey",
                in: "header",
                name: X_AUTH_TOKEN_KEY,
                description: "JWT access token"
            }
        },
        noImplicitAdditionalProperties: "throw-on-extras",
        host: process.env.HOST,
        description: "Enterprise NodeJs/Typescript API boilerplate",
        version: "1.0.0",
        name: "node-typescript-boilerplate",
        specVersion: 3,
        schemes: [protocol],
        outputDirectory: "./",
        controllerPathGlobs: [controllers]
    };

    const routeOptions: RoutesConfig = {
        basePath,
        entryFile,
        middleware: "express",
        authenticationModule: "./src/ui/api/middleware/auth_middleware",
        iocModule: "./src/infrastructure/config/ioc",
        routesDir: "./src/ui/api",
        controllerPathGlobs: [controllers]
    };

    await generateSwaggerSpec(swaggerOptions, routeOptions);

    await generateRoutes(routeOptions, swaggerOptions);
};
