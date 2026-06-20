import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {
  AppLogger,
  HttpExceptionFilter,
  LoggerInterceptor,
  TimeoutInterceptor,
} from '@shared/infrastructure/driven-adapters/nestjs';

export const SharedProviders = [
  AppLogger,
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
