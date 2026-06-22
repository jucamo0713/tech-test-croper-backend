/* eslint-disable @typescript-eslint/unbound-method */
import { GetUserByEmailUseCase } from '@users/domain/use-cases';
import { UsersUseCasesMother } from '../../../../../mothers-and-mocks/contexts/users/domain/use-cases/users-use-cases.mother';

describe('GetUserByEmailUseCase', () => {
  describe('execute', () => {
    it('should find a user by email through the repository gateway', async () => {
      const repository = UsersUseCasesMother.repository();
      const user = UsersUseCasesMother.user();
      repository.findByEmail.mockResolvedValue(user);
      const useCase = new GetUserByEmailUseCase(repository);

      const result = await useCase.execute(UsersUseCasesMother.email());

      expect(repository.findByEmail).toHaveBeenCalledWith(
        UsersUseCasesMother.email(),
      );
      expect(result).toEqual(user.toPrimitives());
    });

    it('should return null when user does not exist', async () => {
      const repository = UsersUseCasesMother.repository();
      repository.findByEmail.mockResolvedValue(null);
      const useCase = new GetUserByEmailUseCase(repository);

      const result = await useCase.execute(UsersUseCasesMother.email());

      expect(result).toBeNull();
    });
  });
});
