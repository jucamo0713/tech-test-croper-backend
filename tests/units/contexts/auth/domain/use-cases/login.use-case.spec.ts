/* eslint-disable @typescript-eslint/unbound-method */
import { UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from '@auth/domain/use-cases';
import { CryptoUtils } from '@shared/domain/use-cases/utils';
import { AuthUseCasesMother } from '../../../../../mothers-and-mocks/contexts/auth/domain/use-cases/auth-use-cases.mother';

describe('LoginUseCase', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('execute', () => {
    it('should return a safe auth response when credentials are valid', async () => {
      const usersAuthGateway = AuthUseCasesMother.usersAuthGateway();
      const tokenRepository = AuthUseCasesMother.tokenRepository();
      const user = AuthUseCasesMother.userForAuthentication();
      usersAuthGateway.findUserByEmail.mockResolvedValue(user);
      const compareStrongHashSpy = jest
        .spyOn(CryptoUtils, 'compareStrongHash')
        .mockResolvedValue(true);
      const useCase = new LoginUseCase(
        usersAuthGateway,
        tokenRepository,
        AuthUseCasesMother.tokenConfig(),
      );

      const result = await useCase.execute({
        email: AuthUseCasesMother.email(),
        password: AuthUseCasesMother.password(),
      });

      expect(usersAuthGateway.findUserByEmail).toHaveBeenCalledWith(
        AuthUseCasesMother.email(),
      );
      expect(compareStrongHashSpy).toHaveBeenCalledWith(
        user.passwordHash,
        AuthUseCasesMother.password(),
      );
      expect(tokenRepository.sign).toHaveBeenCalledTimes(2);
      expect(result).toEqual(AuthUseCasesMother.authResponse());
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const usersAuthGateway = AuthUseCasesMother.usersAuthGateway();
      const tokenRepository = AuthUseCasesMother.tokenRepository();
      usersAuthGateway.findUserByEmail.mockResolvedValue(
        AuthUseCasesMother.userForAuthentication(),
      );
      const compareStrongHashSpy = jest
        .spyOn(CryptoUtils, 'compareStrongHash')
        .mockResolvedValue(false);
      const useCase = new LoginUseCase(
        usersAuthGateway,
        tokenRepository,
        AuthUseCasesMother.tokenConfig(),
      );

      await expect(
        useCase.execute({
          email: AuthUseCasesMother.email(),
          password: AuthUseCasesMother.password(),
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(compareStrongHashSpy).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      const usersAuthGateway = AuthUseCasesMother.usersAuthGateway();
      const tokenRepository = AuthUseCasesMother.tokenRepository();
      usersAuthGateway.findUserByEmail.mockResolvedValue(null);
      const compareStrongHashSpy = jest.spyOn(CryptoUtils, 'compareStrongHash');
      const useCase = new LoginUseCase(
        usersAuthGateway,
        tokenRepository,
        AuthUseCasesMother.tokenConfig(),
      );

      await expect(
        useCase.execute({
          email: AuthUseCasesMother.email(),
          password: AuthUseCasesMother.password(),
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(compareStrongHashSpy).not.toHaveBeenCalled();
    });
  });
});
