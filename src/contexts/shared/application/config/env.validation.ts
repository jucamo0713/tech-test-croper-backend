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
});
