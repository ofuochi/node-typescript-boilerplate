"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load .env configuration into nodejs process
const envFound = dotenv_1.default.config();
if (!envFound) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}
const envConfigSchema = joi_1.default.object({
    NODE_ENV: joi_1.default.string()
        .allow("development", "production", "test")
        .default("development"),
    PORT: joi_1.default.number().default(3000),
    JWT_SECRET: joi_1.default.string()
        .required()
        .description("JWT Secret required"),
    HOST: joi_1.default.string().default("http://localhost:3000"),
    APP_EMAIL: joi_1.default.string().default("node-typescript-boilerplate@sample.com"),
    LOG_LEVEL: joi_1.default.string().default("silly"),
    MAIL_API_KEY: joi_1.default.string().description("Mail gun API key"),
    MAIL_API_DOMAIN: joi_1.default.string(),
    MONGODB_URI: joi_1.default.string().default("mongodb://localhost:27017/node-typescript-boilerplate")
})
    .unknown()
    .required();
const { error, value: envConfig } = envConfigSchema.validate(process.env);
if (error)
    throw new Error(`Config validation error: ${error.message}`);
exports.default = {
    port: parseInt(envConfig.PORT),
    baseUrl: envConfig.HOST,
    env: envConfig.NODE_ENV,
    conStr: envConfig.MONGODB_URI,
    jwtSecret: envConfig.JWT_SECRET,
    /**
     * Used by winston logger
     */
    logs: {
        level: envConfig.LOG_LEVEL
    },
    /**
     * Agenda.js stuff
     */
    agenda: {
        dbCollection: process.env.AGENDA_DB_COLLECTION,
        pooltime: process.env.AGENDA_POOL_TIME,
        concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10)
    },
    /**
     * Agendash config
     */
    agendash: {
        user: "agendash",
        password: "123456"
    },
    /**
     * API configs
     */
    api: {
        prefix: "/api"
    },
    /**
     * Mailgun email credentials
     */ emails: {
        apiKey: envConfig.MAIL_API_KEY,
        domain: envConfig.MAIL_API_DOMAIN,
        from: envConfig.APP_EMAIL
    }
};
//# sourceMappingURL=index.js.map