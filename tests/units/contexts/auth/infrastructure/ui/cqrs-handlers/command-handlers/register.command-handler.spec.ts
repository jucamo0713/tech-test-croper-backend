/* eslint-disable @typescript-eslint/unbound-method */
import { RegisterCommandHandler } from '@auth/infrastructure/ui/cqrs-handlers/command-handlers';
import { RegisterUseCase } from '@auth/domain/use-cases';
import { AuthUseCasesMother } from '../../../../../../../mothers-and-mocks/contexts/auth/domain/use-cases/auth-use-cases.mother';

describe('RegisterCommandHandler', () => {
  describe('execute', () => {
    it('should call register use case', async () => {
      const registerUseCase = {
        execute: jest.fn().mockResolvedValue(AuthUseCasesMother.authResponse()),
      } as unknown as jest.Mocked<RegisterUseCase>;
      const handler = new RegisterCommandHandler(registerUseCase);
      const command = AuthUseCasesMother.registerCommand();

      const result = await handler.execute(command);

      expect(registerUseCase.execute).toHaveBeenCalledWith({
        email: command.email,
        password: command.password,
      });
      expect(result).toEqual(AuthUseCasesMother.authResponse());
    });
  });
});
