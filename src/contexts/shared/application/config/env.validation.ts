import Joi from 'joi';
import { EnvironmentVariables } from './env.types';

export const envValidationSchema = Joi.object<EnvironmentVariables>({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').required(),
  PORT: Joi.number().integer().min(1).max(65535).required(),
  APP_NAME: Joi.string().required(),
  API_PREFIX: Joi.string().required(),
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'log', 'debug', 'verbose')
    .required(),
  DEFAULT_TIMEOUT_MS: Joi.number().integer().min(1).max(300000).required(),
  MONGO_URI: Joi.string()
    .uri({
      scheme: ['mongodb', 'mongodb+srv'],
    })
    .required(),
  SWAGGER_ENABLED: Joi.boolean().required(),
  SWAGGER_PATH: Joi.string()
    .trim()
    .pattern(/^[a-zA-Z0-9][a-zA-Z0-9/_-]*$/)
    .required(),
  SWAGGER_TITLE: Joi.string().trim().required(),
  SWAGGER_DESCRIPTION: Joi.string().trim().required(),
  SWAGGER_VERSION: Joi.string().trim().required(),
  SESSION_TOKEN_SECRET: Joi.string().min(32).required(),
  SESSION_TOKEN_EXPIRES_IN_SECONDS: Joi.number().integer().min(1).required(),
  REFRESH_TOKEN_SECRET: Joi.string().min(32).required(),
  REFRESH_TOKEN_EXPIRES_IN_SECONDS: Joi.number().integer().min(1).required(),
});
