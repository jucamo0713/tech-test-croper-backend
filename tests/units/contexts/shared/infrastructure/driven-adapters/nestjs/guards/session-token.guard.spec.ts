/* eslint-disable @typescript-eslint/unbound-method */
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtSessionGuard } from '@shared/infrastructure/driven-adapters/nestjs';
import { TokenRepository } from '@shared/domain/models/gateways';

const createExecutionContext = (authorization?: string): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          authorization,
        },
      }),
    }),
  }) as unknown as ExecutionContext;

describe('JwtSessionGuard', () => {
  describe('canActivate', () => {
    it('should validate bearer token and attach user payload', () => {
      const payload = { userId: 'user-id', email: 'user@test.com' };
      const tokenRepository = {
        verify: jest.fn().mockReturnValue(payload),
      } as unknown as jest.Mocked<TokenRepository>;
      const configService = {
        getOrThrow: jest.fn().mockReturnValue('session-secret'),
      } as unknown as ConfigService;
      const context = createExecutionContext('Bearer session-token');
      const guard = new JwtSessionGuard(tokenRepository, configService);

      expect(guard.canActivate(context)).toBe(true);
      expect(tokenRepository.verify).toHaveBeenCalledWith(
        'session-token',
        'session-secret',
      );
    });

    it('should reject missing bearer token', () => {
      const guard = new JwtSessionGuard(
        { verify: jest.fn() } as unknown as TokenRepository,
        { getOrThrow: jest.fn() } as unknown as ConfigService,
      );

      expect(() => guard.canActivate(createExecutionContext())).toThrow(
        UnauthorizedException,
      );
    });
  });
});
