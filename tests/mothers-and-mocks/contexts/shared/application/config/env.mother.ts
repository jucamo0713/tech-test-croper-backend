import { EnvironmentVariables } from '@shared/application/config';

export const EnvMother = {
  valid(overrides: Partial<EnvironmentVariables> = {}): EnvironmentVariables {
    return {
      NODE_ENV: 'test',
      PORT: 3000,
      APP_NAME: 'test-backend',
      API_PREFIX: 'api',
      LOG_LEVEL: 'log',
      DEFAULT_TIMEOUT_MS: 30000,
      MONGO_URI: 'mongodb://localhost:27017/croper-test',
      SWAGGER_ENABLED: true,
      SWAGGER_PATH: 'docs',
      SWAGGER_TITLE: 'Croper API',
      SWAGGER_DESCRIPTION: 'Croper backend API documentation',
      SWAGGER_VERSION: '1.0.0',
      SESSION_TOKEN_SECRET: 'session-secret-minimum-32-characters',
      SESSION_TOKEN_EXPIRES_IN_SECONDS: 900,
      REFRESH_TOKEN_SECRET: 'refresh-secret-minimum-32-characters',
      REFRESH_TOKEN_EXPIRES_IN_SECONDS: 604800,
      ...overrides,
    };
  },
} as const;
