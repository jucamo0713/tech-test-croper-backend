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
      ...overrides,
    };
  },
} as const;
