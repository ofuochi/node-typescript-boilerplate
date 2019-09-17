import Joi from "@hapi/joi";
import dotenv from "dotenv";

// Load .env configuration into nodejs process
const envFound = dotenv.config();
if (!envFound) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const envConfigSchema = Joi.object({
    NODE_ENV: Joi.string()
        .allow("development", "production", "test")
        .default("development"),
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string()
        .required()
        .description("JWT Secret required"),
    HOST: Joi.string().default("http://localhost:3000"),
    APP_EMAIL: Joi.string().default("node-typescript-boilerplate@sample.com"),
    LOG_LEVEL: Joi.string().default("silly"),
    MAIL_API_KEY: Joi.string().description("Mail gun API key"),
    MAIL_API_DOMAIN: Joi.string(),
    MONGODB_URI: Joi.string().default(
        "mongodb://localhost:27017/node-typescript-boilerplate"
    )
})
    .unknown()
    .required();

const { error, value: envConfig } = envConfigSchema.validate(process.env);
if (error) throw new Error(`Config validation error: ${error.message}`);

export default {
    port: parseInt(envConfig.PORT as string),
    baseUrl: envConfig.HOST as string,
    env: envConfig.NODE_ENV as string,
    conStr: envConfig.MONGODB_URI as string,
    jwtSecret: envConfig.JWT_SECRET as string,

    /**
     * Used by winston logger
     */
    logs: {
        level: envConfig.LOG_LEVEL as string
    },

    /**
     * Agenda.js stuff
     */
    agenda: {
        dbCollection: process.env.AGENDA_DB_COLLECTION,
        pooltime: process.env.AGENDA_POOL_TIME,
        concurrency: parseInt(process.env.AGENDA_CONCURRENCY as string, 10)
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
        apiKey: envConfig.MAIL_API_KEY as string,
        domain: envConfig.MAIL_API_DOMAIN as string,
        from: envConfig.APP_EMAIL as string
    }
};
