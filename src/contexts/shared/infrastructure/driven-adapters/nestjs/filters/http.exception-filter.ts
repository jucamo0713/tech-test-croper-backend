import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ExceptionDto } from './exception.dto';
import type { Request, Response } from 'express';
import { AsyncRequestContext } from '@shared/infrastructure/driven-adapters/nestjs/context';
import { ErrorUtils } from '@shared/domain/use-cases/utils';

/**
 * Message that is thrown by default if there is no exception.
 */
const INTERNAL_SERVER_ERROR: string = 'INTERNAL_SERVER_ERROR';

/**
 * Exception filter for handling NestJS exceptions and providing standardized error response.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: Logger = new Logger(HttpExceptionFilter.name);

  /**
   * Handles exceptions caught by NestJS and provides standardized error response.
   * @param exception - The exception caught by NestJS.
   * @param host - The context host of the execution.
   */
  public catch(exception: Error, host: ArgumentsHost) {
    this.logger.error(JSON.stringify(exception));
    const response: ExceptionDto = new ExceptionDto();
    response.timestamp = Date.now().toString();
    response.requestId = AsyncRequestContext.get('requestId') ?? 'undefined';
    if (exception instanceof HttpException) {
      this.logger.error(
        `[${this.catch.name}] ERROR :: CONTROLLED EXCEPTION OCCURRED `,
      );
      response.httpStatusCode = exception.getStatus();
      response.message = ErrorUtils.resolveErrorMessage(exception);
      response.location = exception.stack;
    } else {
      this.logger.error(
        `[${this.catch.name}] ERROR :: UNCONTROLLED EXCEPTION OCCURRED`,
      );
      response.message = ErrorUtils.resolveErrorMessage(exception);
      response.httpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      response.location = exception.stack;
    }
    if (!response.message) response.message = INTERNAL_SERVER_ERROR;
    try {
      switch (host.getType()) {
        case 'http':
          response.path = host.switchToHttp().getRequest<Request>().url;
          response.method = host.switchToHttp().getRequest<Request>().method;
          host
            .switchToHttp()
            .getResponse<Response>()
            .status(response.httpStatusCode)
            .json(response);
          break;
        default:
          throw new InternalServerErrorException(
            `PROTOCOL ${host.getType()} HAS NOT IMPLEMENTED`,
          );
      }
    } finally {
      this.logger.error(`ERROR :: ${JSON.stringify(response)}`);
    }
  }
}
