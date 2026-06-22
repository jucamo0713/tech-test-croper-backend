/* eslint-disable @typescript-eslint/unbound-method */
import {
  LoginCommand,
  RefreshTokenCommand,
  RegisterCommand,
} from '@auth/domain/models/cqrs/commands';
import { AuthController } from '@auth/infrastructure/ui/controllers/auth.controller';
import { UsersAuthCqrsAdapterMother } from '../../../../../../mothers-and-mocks/contexts/auth/infrastructure/driven-adapters/users-auth-cqrs-adapter.mother';
import { AuthUseCasesMother } from '../../../../../../mothers-and-mocks/contexts/auth/domain/use-cases/auth-use-cases.mother';

describe('AuthController', () => {
  describe('register', () => {
    it('should execute RegisterCommand using CqrsCaller', async () => {
      const cqrsCaller = UsersAuthCqrsAdapterMother.cqrsCaller();
      cqrsCaller.dispatch.mockResolvedValue(AuthUseCasesMother.authResponse());
      const controller = new AuthController(cqrsCaller);

      const result = await controller.register({
        email: AuthUseCasesMother.email(),
        password: AuthUseCasesMother.password(),
      });

      expect(cqrsCaller.dispatch).toHaveBeenCalledWith(
        expect.any(RegisterCommand),
        {
          showCommand: false,
          showResult: false,
        },
      );
      expect(result).toEqual(AuthUseCasesMother.authResponse());
    });
  });

  describe('login', () => {
    it('should execute LoginCommand using CqrsCaller', async () => {
      const cqrsCaller = UsersAuthCqrsAdapterMother.cqrsCaller();
      cqrsCaller.dispatch.mockResolvedValue(AuthUseCasesMother.authResponse());
      const controller = new AuthController(cqrsCaller);

      const result = await controller.login({
        email: AuthUseCasesMother.email(),
        password: AuthUseCasesMother.password(),
      });

      expect(cqrsCaller.dispatch).toHaveBeenCalledWith(
        expect.any(LoginCommand),
        {
          showCommand: false,
          showResult: false,
        },
      );
      expect(cqrsCaller.query).not.toHaveBeenCalled();
      expect(result).toEqual(AuthUseCasesMother.authResponse());
    });
  });

  describe('refresh', () => {
    it('should execute RefreshTokenCommand using CqrsCaller', async () => {
      const cqrsCaller = UsersAuthCqrsAdapterMother.cqrsCaller();
      cqrsCaller.dispatch.mockResolvedValue(AuthUseCasesMother.authResponse());
      const controller = new AuthController(cqrsCaller);

      const result = await controller.refresh({
        refreshToken: AuthUseCasesMother.refreshToken(),
      });

      expect(cqrsCaller.dispatch).toHaveBeenCalledWith(
        expect.any(RefreshTokenCommand),
        {
          showCommand: false,
          showResult: false,
        },
      );
      expect(cqrsCaller.query).not.toHaveBeenCalled();
      expect(result).toEqual(AuthUseCasesMother.authResponse());
    });
  });
});
