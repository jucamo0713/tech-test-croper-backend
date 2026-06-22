import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
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
