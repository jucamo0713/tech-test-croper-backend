import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { AsyncRequestContext } from '@shared/infrastructure/driven-adapters/nestjs/context';
import { HttpExceptionFilter } from '@shared/infrastructure/driven-adapters/nestjs/filters';
import { HttpMock } from '../../../../../../../mothers-and-mocks/contexts/shared/infrastructure/driven-adapters/nestjs/http.mock';

describe('HttpExceptionFilter', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('catch', () => {
    it('should map controlled HTTP exceptions into the standard response', () => {
      jest.spyOn(Logger.prototype, 'error').mockImplementation();
      const filter = new HttpExceptionFilter();
      const response = HttpMock.response();
      const context = HttpMock.executionContext({ response });

      AsyncRequestContext.setData({ requestId: 'request-id-1' }, () => {
        filter.catch(new BadRequestException('Invalid request'), context);
      });

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          httpStatusCode: 400,
          message: 'Invalid request',
          method: 'GET',
          path: '/api/test',
          requestId: 'request-id-1',
        }),
      );
    });

    it('should map uncontrolled errors into internal server errors', () => {
      jest.spyOn(Logger.prototype, 'error').mockImplementation();
      const filter = new HttpExceptionFilter();
      const response = HttpMock.response();
      const context = HttpMock.executionContext({ response });

      filter.catch(new Error('Unexpected'), context);

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          httpStatusCode: 500,
          message: 'Unexpected',
          requestId: 'undefined',
        }),
      );
    });

    it('should reject unsupported protocols', () => {
      jest.spyOn(Logger.prototype, 'error').mockImplementation();
      const filter = new HttpExceptionFilter();

      expect(() =>
        filter.catch(
          new Error('Unexpected'),
          HttpMock.executionContext({ type: 'rpc' }),
        ),
      ).toThrow(InternalServerErrorException);
    });
  });
});
