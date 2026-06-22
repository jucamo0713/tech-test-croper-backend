import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {
  CqrsCallerRepositoryToken,
  TokenRepositoryToken,
} from '@shared/domain/models/gateways';
import { JwtTokenRepository } from '@shared/infrastructure/driven-adapters/jwt';
import {
  AppLogger,
  HttpExceptionFilter,
  LoggerInterceptor,
  NestCqrsCaller,
  TimeoutInterceptor,
} from '@shared/infrastructure/driven-adapters/nestjs';

export const SharedProviders = [
  AppLogger,
  NestCqrsCaller,
  JwtTokenRepository,
  {
    provide: CqrsCallerRepositoryToken,
    useExisting: NestCqrsCaller,
  },
  {
    provide: TokenRepositoryToken,
    useExisting: JwtTokenRepository,
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
];
