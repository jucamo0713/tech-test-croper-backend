/* eslint-disable @typescript-eslint/unbound-method */
import { CreateUserCommand } from '@users/domain/models/cqrs/commands';
import { CreateUserUseCase } from '@users/domain/use-cases';
import { CreateUserCommandHandler } from '@users/infrastructure/ui/cqrs-handlers/command-handlers';
import { UsersUseCasesMother } from '../../../../../../../mothers-and-mocks/contexts/users/domain/use-cases/users-use-cases.mother';

describe('CreateUserCommandHandler', () => {
  describe('execute', () => {
    it('should call create user use case', async () => {
      const response = {
        userId: 'user-id',
        email: UsersUseCasesMother.email(),
        status: 'active',
      };
      const createUserUseCase = {
        execute: jest.fn().mockResolvedValue(response),
      } as unknown as jest.Mocked<CreateUserUseCase>;
      const handler = new CreateUserCommandHandler(createUserUseCase);
      const command = new CreateUserCommand(
        UsersUseCasesMother.email(),
        UsersUseCasesMother.passwordHash(),
      );

      const result = await handler.execute(command);

      expect(createUserUseCase.execute).toHaveBeenCalledWith({
        email: command.email,
        passwordHash: command.passwordHash,
        status: command.status,
      });
      expect(result).toEqual(response);
    });
  });
});
