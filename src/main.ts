import type { LogLevel as NestLogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { EnvironmentVariables } from '@shared/application/config';
import { AppLogger } from '@shared/infrastructure/driven-adapters/nestjs';
import { AppModule } from './app.module';

const LOG_LEVELS_BY_MIN_LEVEL: Record<
  EnvironmentVariables['LOG_LEVEL'],
  NestLogLevel[]
> = {
  error: ['error'],
  warn: ['error', 'warn'],
  log: ['error', 'warn', 'log'],
  debug: ['error', 'warn', 'log', 'debug'],
  verbose: ['error', 'warn', 'log', 'debug', 'verbose'],
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService<EnvironmentVariables, true>);
  const appLogger = app.get(AppLogger);

  const appName = configService.getOrThrow('APP_NAME', { infer: true });
  const apiPrefix = configService.getOrThrow('API_PREFIX', { infer: true });
  const logLevel = configService.getOrThrow('LOG_LEVEL', { infer: true });
  const nodeEnv = configService.getOrThrow('NODE_ENV', { infer: true });
  const port = configService.getOrThrow('PORT', { infer: true });

  appLogger.setLogLevels(LOG_LEVELS_BY_MIN_LEVEL[logLevel]);
  app.useLogger(appLogger);
  app.setGlobalPrefix(apiPrefix);

  await app.listen(port);

  appLogger.log(
    `${appName} running on port ${port} with prefix /${apiPrefix} (${nodeEnv})`,
    'Bootstrap',
  );
}
void bootstrap();
