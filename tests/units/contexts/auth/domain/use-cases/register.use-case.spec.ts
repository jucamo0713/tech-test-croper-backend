/* eslint-disable @typescript-eslint/unbound-method */
import { RegisterUseCase } from '@auth/domain/use-cases';
import { CryptoUtils } from '@shared/domain/use-cases/utils';
import { AuthUseCasesMother } from '../../../../../mothers-and-mocks/contexts/auth/domain/use-cases/auth-use-cases.mother';

describe('RegisterUseCase', () => {
  describe('execute', () => {
    it('should hash the password, call users gateway and return a safe response', async () => {
      const usersAuthGateway = AuthUseCasesMother.usersAuthGateway();
      const authUser = AuthUseCasesMother.authUser();
      const tokenRepository = AuthUseCasesMother.tokenRepository();
      const passwordHash = AuthUseCasesMother.passwordHash();
      const strongHashSpy = jest
        .spyOn(CryptoUtils, 'strongHash')
        .mockResolvedValue(passwordHash);
      usersAuthGateway.createUser.mockResolvedValue(authUser);
      const useCase = new RegisterUseCase(
        usersAuthGateway,
        tokenRepository,
        AuthUseCasesMother.tokenConfig(),
      );

      const result = await useCase.execute({
        email: AuthUseCasesMother.email(),
        password: AuthUseCasesMother.password(),
      });

      expect(strongHashSpy).toHaveBeenCalledWith(AuthUseCasesMother.password());
      expect(usersAuthGateway.createUser).toHaveBeenCalledWith({
        email: AuthUseCasesMother.email(),
        passwordHash,
      });
      expect(usersAuthGateway.createUser).not.toHaveBeenCalledWith(
        expect.objectContaining({
          password: AuthUseCasesMother.password(),
        }),
      );
      expect(tokenRepository.sign).toHaveBeenCalledTimes(2);
      expect(result).toEqual(AuthUseCasesMother.authResponse());
      expect(result).not.toHaveProperty('passwordHash');
    });
  });
});
