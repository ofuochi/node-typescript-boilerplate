import * as dotenv from 'dotenv';
import * as fs from 'fs';

import * as Joi from '@hapi/joi';

export interface EnvConfig {
	nodeEnv: string;
	port: number;
	mongoDbUri: string;
	jwtSecret: string;
	maxLoginAttempts: number;
	lockoutDurationMinutes: number;
	isApiAuthEnabled: boolean;
}

export class ConfigService {
	static envConfig: EnvConfig;
	private readonly _config: EnvConfig;

	constructor(filePath: string) {
		filePath = filePath || `${process.env.NODE_ENV || "development"}.env`;
		const config = dotenv.parse(fs.readFileSync(filePath));
		ConfigService.envConfig = this.validateInput(config);
		this._config = ConfigService.envConfig;
	}

	/**
	 * Ensures all needed variables are set, and returns the validated JavaScript object
	 * including the applied default values.
	 */
	private validateInput(envConfig: dotenv.DotenvParseOutput): EnvConfig {
		const envVarsSchema: Joi.ObjectSchema = Joi.object({
			NODE_ENV: Joi.string()
				.valid("development", "production", "test", "provision")
				.default("development"),
			MONGODB_URI: Joi.string().required(),
			JWT_SECRET: Joi.string().required(),
			MAX_LOGIN_ATTEMPTS: Joi.number().default(5),
			LOCKOUT_DURATION_MINUTES: Joi.number().default(5),
			PORT: Joi.number().default(3000),
			API_AUTH_ENABLED: Joi.boolean().required()
		});

		const { error, value } = envVarsSchema.validate(envConfig);
		if (error) {
			throw new Error(`Config validation error: ${error.message}`);
		}
		dotenv.config(envConfig);

		return {
			mongoDbUri: value.MONGODB_URI,
			isApiAuthEnabled: value.API_AUTH_ENABLED,
			nodeEnv: value.NODE_ENV,
			port: value.PORT,
			jwtSecret: value.JWT_SECRET,
			lockoutDurationMinutes: value.LOCKOUT_DURATION_MINUTES,
			maxLoginAttempts: value.MAX_LOGIN_ATTEMPTS
		};
	}
	get env() {
		return this._config;
	}
	get isApiAuthEnabled(): boolean {
		return Boolean(ConfigService.envConfig.isApiAuthEnabled);
	}
}
