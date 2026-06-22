import { envValidationSchema } from '@shared/application/config';

const validEnvironmentVariables = {
  NODE_ENV: 'production',
  PORT: 8080,
  APP_NAME: 'croper-backend',
  API_PREFIX: 'api/v1',
  LOG_LEVEL: 'debug',
  DEFAULT_TIMEOUT_MS: 15000,
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
};

describe('envValidationSchema', () => {
  describe('validate', () => {
    it('should accept valid environment variables', () => {
      const validationResult = envValidationSchema.validate(
        validEnvironmentVariables,
      );

      expect(validationResult.error).toBeUndefined();
      expect(validationResult.value).toEqual(validEnvironmentVariables);
    });

    it('should reject missing environment variables', () => {
      const validationResult = envValidationSchema.validate({});

      expect(validationResult.error).toBeDefined();
      expect(validationResult.error?.details[0].path).toEqual(['NODE_ENV']);
    });

    it('should reject invalid NODE_ENV', () => {
      const { error } = envValidationSchema.validate({
        ...validEnvironmentVariables,
        NODE_ENV: 'local',
      });

      expect(error).toBeDefined();
      expect(error?.details[0].path).toEqual(['NODE_ENV']);
    });

    it('should reject invalid PORT', () => {
      const { error } = envValidationSchema.validate({
        ...validEnvironmentVariables,
        PORT: 'not-a-port',
      });

      expect(error).toBeDefined();
      expect(error?.details[0].path).toEqual(['PORT']);
    });

    it('should reject PORT outside the allowed range', () => {
      const { error } = envValidationSchema.validate({
        ...validEnvironmentVariables,
        PORT: 65536,
      });

      expect(error).toBeDefined();
      expect(error?.details[0].path).toEqual(['PORT']);
    });

    it('should reject invalid LOG_LEVEL', () => {
      const { error } = envValidationSchema.validate({
        ...validEnvironmentVariables,
        LOG_LEVEL: 'trace',
      });

      expect(error).toBeDefined();
      expect(error?.details[0].path).toEqual(['LOG_LEVEL']);
    });

    it('should reject invalid DEFAULT_TIMEOUT_MS', () => {
      const { error } = envValidationSchema.validate({
        ...validEnvironmentVariables,
        DEFAULT_TIMEOUT_MS: 0,
      });

      expect(error).toBeDefined();
      expect(error?.details[0].path).toEqual(['DEFAULT_TIMEOUT_MS']);
    });

    it('should reject invalid MONGO_URI', () => {
      const { error } = envValidationSchema.validate({
        ...validEnvironmentVariables,
        MONGO_URI: 'not-a-mongo-uri',
      });

      expect(error).toBeDefined();
      expect(error?.details[0].path).toEqual(['MONGO_URI']);
    });

    it('should reject invalid SWAGGER_PATH', () => {
      const { error } = envValidationSchema.validate({
        ...validEnvironmentVariables,
        SWAGGER_PATH: '/docs',
      });

      expect(error).toBeDefined();
      expect(error?.details[0].path).toEqual(['SWAGGER_PATH']);
    });

    it('should reject short session token secret', () => {
      const { error } = envValidationSchema.validate({
        ...validEnvironmentVariables,
        SESSION_TOKEN_SECRET: 'short',
      });

      expect(error).toBeDefined();
      expect(error?.details[0].path).toEqual(['SESSION_TOKEN_SECRET']);
    });

    it('should reject short refresh token secret', () => {
      const { error } = envValidationSchema.validate({
        ...validEnvironmentVariables,
        REFRESH_TOKEN_SECRET: 'short',
      });

      expect(error).toBeDefined();
      expect(error?.details[0].path).toEqual(['REFRESH_TOKEN_SECRET']);
    });
  });
});
