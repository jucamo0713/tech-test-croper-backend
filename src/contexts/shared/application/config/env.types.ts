export type NodeEnvironment = 'development' | 'test' | 'production';

export type LogLevel = 'error' | 'warn' | 'log' | 'debug' | 'verbose';

export interface EnvironmentVariables {
  NODE_ENV: NodeEnvironment;
  PORT: number;
  APP_NAME: string;
  API_PREFIX: string;
  LOG_LEVEL: LogLevel;
  DEFAULT_TIMEOUT_MS: number;
  MONGO_URI: string;
  SWAGGER_ENABLED: boolean;
  SWAGGER_PATH: string;
  SWAGGER_TITLE: string;
  SWAGGER_DESCRIPTION: string;
  SWAGGER_VERSION: string;
  SESSION_TOKEN_SECRET: string;
  SESSION_TOKEN_EXPIRES_IN_SECONDS: number;
  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRES_IN_SECONDS: number;
}
