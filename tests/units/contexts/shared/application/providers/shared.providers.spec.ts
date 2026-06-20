import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { SharedProviders } from '@shared/application/providers';
import {
  AppLogger,
  HttpExceptionFilter,
  LoggerInterceptor,
  TimeoutInterceptor,
} from '@shared/infrastructure/driven-adapters/nestjs';

describe('SharedProviders', () => {
  describe('registration', () => {
    it('should register the shared logger, global filter and global interceptors', () => {
      expect(SharedProviders).toContain(AppLogger);
      expect(SharedProviders).toEqual(
        expect.arrayContaining([
          {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
          },
          {
            provide: APP_INTERCEPTOR,
            useClass: LoggerInterceptor,
          },
          {
            provide: APP_INTERCEPTOR,
            useClass: TimeoutInterceptor,
          },
        ]),
      );
    });
  });
});
