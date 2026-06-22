/* eslint-disable @typescript-eslint/unbound-method */
import { GetUserByEmailQuery } from '@users/domain/models/cqrs/queries';
import { GetUserByEmailUseCase } from '@users/domain/use-cases';
import { GetUserByEmailQueryHandler } from '@users/infrastructure/ui/cqrs-handlers/query-handlers';
import { UsersUseCasesMother } from '../../../../../../../mothers-and-mocks/contexts/users/domain/use-cases/users-use-cases.mother';

describe('GetUserByEmailQueryHandler', () => {
  describe('execute', () => {
    it('should call get user by email use case', async () => {
      const user = UsersUseCasesMother.user().toPrimitives();
      const getUserByEmailUseCase = {
        execute: jest.fn().mockResolvedValue(user),
      } as unknown as jest.Mocked<GetUserByEmailUseCase>;
      const handler = new GetUserByEmailQueryHandler(getUserByEmailUseCase);
      const query = new GetUserByEmailQuery(UsersUseCasesMother.email());

      const result = await handler.execute(query);

      expect(getUserByEmailUseCase.execute).toHaveBeenCalledWith(query.email);
      expect(result).toEqual(user);
    });
  });
});
