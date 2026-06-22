/* eslint-disable @typescript-eslint/unbound-method */
import { UnauthorizedException } from '@nestjs/common';
import { RefreshTokenUseCase } from '@auth/domain/use-cases';
import { AuthUseCasesMother } from '../../../../../mothers-and-mocks/contexts/auth/domain/use-cases/auth-use-cases.mother';

describe('RefreshTokenUseCase', () => {
  describe('execute', () => {
    it('should return a new safe auth response when refresh token is valid', () => {
      const tokenRepository = AuthUseCasesMother.tokenRepository();
      const tokenConfig = AuthUseCasesMother.tokenConfig();
      const useCase = new RefreshTokenUseCase(tokenRepository, tokenConfig);

      const result = useCase.execute({
        refreshToken: AuthUseCasesMother.refreshToken(),
      });

      expect(tokenRepository.verify).toHaveBeenCalledWith(
        AuthUseCasesMother.refreshToken(),
        tokenConfig.refreshSecret,
      );
      expect(tokenRepository.sign).toHaveBeenCalledTimes(2);
      expect(tokenRepository.sign).toHaveBeenCalledWith(
        AuthUseCasesMother.authUserPrimitives(),
        tokenConfig.sessionSecret,
        tokenConfig.sessionExpiresIn,
      );
      expect(tokenRepository.sign).toHaveBeenCalledWith(
        AuthUseCasesMother.authUserPrimitives(),
        tokenConfig.refreshSecret,
        tokenConfig.refreshExpiresIn,
      );
      expect(result).toEqual(AuthUseCasesMother.authResponse());
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('should throw UnauthorizedException when refresh token is invalid', () => {
      const tokenRepository = AuthUseCasesMother.tokenRepository();
      tokenRepository.verify.mockReturnValue(undefined);
      const useCase = new RefreshTokenUseCase(
        tokenRepository,
        AuthUseCasesMother.tokenConfig(),
      );

      expect(() =>
        useCase.execute({
          refreshToken: AuthUseCasesMother.refreshToken(),
        }),
      ).toThrow(UnauthorizedException);
      expect(tokenRepository.sign).not.toHaveBeenCalled();
    });
  });
});
