import { envValidationSchema } from '@shared/application/config';

const validEnvironmentVariables = {
  NODE_ENV: 'production',
  PORT: 8080,
  APP_NAME: 'croper-backend',
  API_PREFIX: 'api/v1',
  LOG_LEVEL: 'debug',
  DEFAULT_TIMEOUT_MS: 15000,
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
  });
});
