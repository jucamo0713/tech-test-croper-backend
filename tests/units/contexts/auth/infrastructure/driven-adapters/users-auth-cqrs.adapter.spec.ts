/* eslint-disable @typescript-eslint/unbound-method */
import { UsersAuthCqrsAdapter } from '@auth/infrastructure/driven-adapters';
import { CreateUserCommand } from '@users/domain/models/cqrs/commands';
import { GetUserByEmailQuery } from '@users/domain/models/cqrs/queries';
import { AuthUseCasesMother } from '../../../../../mothers-and-mocks/contexts/auth/domain/use-cases/auth-use-cases.mother';
import { UsersAuthCqrsAdapterMother } from '../../../../../mothers-and-mocks/contexts/auth/infrastructure/driven-adapters/users-auth-cqrs-adapter.mother';

describe('UsersAuthCqrsAdapter', () => {
  describe('createUser', () => {
    it('should use CqrsCaller to dispatch CreateUserCommand', async () => {
      const cqrsCaller = UsersAuthCqrsAdapterMother.cqrsCaller();
      cqrsCaller.dispatch.mockResolvedValue(
        UsersAuthCqrsAdapterMother.createdUser(),
      );
      const adapter = new UsersAuthCqrsAdapter(cqrsCaller);

      const result = await adapter.createUser({
        email: AuthUseCasesMother.email(),
        passwordHash: AuthUseCasesMother.passwordHash(),
      });

      expect(cqrsCaller.dispatch).toHaveBeenCalledWith(
        expect.any(CreateUserCommand),
        {
          showCommand: false,
          showResult: false,
        },
      );
      expect(result).toEqual(AuthUseCasesMother.authResponseWithoutTokens());
    });
  });

  describe('findUserByEmail', () => {
    it('should use CqrsCaller to execute GetUserByEmailQuery', async () => {
      const cqrsCaller = UsersAuthCqrsAdapterMother.cqrsCaller();
      const user = UsersAuthCqrsAdapterMother.userForAuthentication();
      cqrsCaller.query.mockResolvedValue(user);
      const adapter = new UsersAuthCqrsAdapter(cqrsCaller);

      const result = await adapter.findUserByEmail(AuthUseCasesMother.email());

      expect(cqrsCaller.query).toHaveBeenCalledWith(
        expect.any(GetUserByEmailQuery),
        {
          showQuery: false,
          showResult: false,
        },
      );
      expect(cqrsCaller.dispatch).not.toHaveBeenCalled();
      expect(result).toEqual(user);
    });
  });
});
