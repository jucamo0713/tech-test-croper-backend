/* eslint-disable @typescript-eslint/unbound-method */
import { LoginCommandHandler } from '@auth/infrastructure/ui/cqrs-handlers/command-handlers';
import { LoginUseCase } from '@auth/domain/use-cases';
import { AuthUseCasesMother } from '../../../../../../../mothers-and-mocks/contexts/auth/domain/use-cases/auth-use-cases.mother';

describe('LoginCommandHandler', () => {
  describe('execute', () => {
    it('should call login use case', async () => {
      const loginUseCase = {
        execute: jest.fn().mockResolvedValue(AuthUseCasesMother.authResponse()),
      } as unknown as jest.Mocked<LoginUseCase>;
      const handler = new LoginCommandHandler(loginUseCase);
      const command = AuthUseCasesMother.loginCommand();

      const result = await handler.execute(command);

      expect(loginUseCase.execute).toHaveBeenCalledWith({
        email: command.email,
        password: command.password,
      });
      expect(result).toEqual(AuthUseCasesMother.authResponse());
    });
  });
});
