import { ValidationPipe, type LogLevel as NestLogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
  const swaggerEnabled = configService.getOrThrow('SWAGGER_ENABLED', {
    infer: true,
  });

  app.enableCors({
    allowedHeaders: '*',
    methods: '*',
    origin: '*',
  });
  appLogger.setLogLevels(LOG_LEVELS_BY_MIN_LEVEL[logLevel]);
  app.useLogger(appLogger);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );
  app.setGlobalPrefix(apiPrefix);

  if (swaggerEnabled) {
    const swaggerPath = configService.getOrThrow('SWAGGER_PATH', {
      infer: true,
    });
    const swaggerConfig = new DocumentBuilder()
      .setTitle(configService.getOrThrow('SWAGGER_TITLE', { infer: true }))
      .setDescription(
        configService.getOrThrow('SWAGGER_DESCRIPTION', { infer: true }),
      )
      .setVersion(configService.getOrThrow('SWAGGER_VERSION', { infer: true }))
      .addBearerAuth()
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup(swaggerPath, app, swaggerDocument, {
      useGlobalPrefix: true,
    });
  }

  await app.listen(port);

  appLogger.log(
    `${appName} running on port ${port} with prefix /${apiPrefix} (${nodeEnv})`,
    'Bootstrap',
  );
}
void bootstrap();
