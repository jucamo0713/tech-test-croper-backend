/* eslint-disable @typescript-eslint/unbound-method */
import { CreateUserUseCase } from '@users/domain/use-cases';
import { UsersUseCasesMother } from '../../../../../mothers-and-mocks/contexts/users/domain/use-cases/users-use-cases.mother';

describe('CreateUserUseCase', () => {
  describe('execute', () => {
    it('should create a user through the repository gateway and return safe primitives', async () => {
      const repository = UsersUseCasesMother.repository();
      const createdUser = UsersUseCasesMother.user();
      repository.create.mockResolvedValue(createdUser);
      const useCase = new CreateUserUseCase(repository);

      const result = await useCase.execute({
        email: UsersUseCasesMother.email(),
        passwordHash: UsersUseCasesMother.passwordHash(),
        status: 'active',
      });

      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual({
        userId: createdUser.toPrimitives().userId,
        email: createdUser.toPrimitives().email,
        status: createdUser.toPrimitives().status,
      });
      expect(result).not.toHaveProperty('passwordHash');
    });
  });
});
