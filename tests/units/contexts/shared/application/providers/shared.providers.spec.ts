import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { SharedProviders } from '@shared/application/providers';
import { CqrsCallerRepositoryToken } from '@shared/domain/models/gateways';
import {
  AppLogger,
  HttpExceptionFilter,
  LoggerInterceptor,
  NestCqrsCaller,
  TimeoutInterceptor,
} from '@shared/infrastructure/driven-adapters/nestjs';

describe('SharedProviders', () => {
  describe('registration', () => {
    it('should register the shared logger, global filter and global interceptors', () => {
      expect(SharedProviders).toContain(AppLogger);
      expect(SharedProviders).toContain(NestCqrsCaller);
      expect(SharedProviders).toEqual(
        expect.arrayContaining([
          {
            provide: CqrsCallerRepositoryToken,
            useExisting: NestCqrsCaller,
          },
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
