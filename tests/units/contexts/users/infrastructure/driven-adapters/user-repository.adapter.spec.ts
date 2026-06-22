import { UserRepositoryAdapter } from '@users/infrastructure/driven-adapters';
import { UserRepositoryAdapterMother } from '../../../../../mothers-and-mocks/contexts/users/infrastructure/driven-adapters/user-repository-adapter.mother';
import { UsersUseCasesMother } from '../../../../../mothers-and-mocks/contexts/users/domain/use-cases/users-use-cases.mother';

describe('UserRepositoryAdapter', () => {
  describe('create', () => {
    it('should persist and return a domain user', async () => {
      const userModel = UserRepositoryAdapterMother.userModel();
      const userDto = UserRepositoryAdapterMother.userDto();
      userModel.create.mockResolvedValue(
        UserRepositoryAdapterMother.createdDocument(userDto),
      );
      const adapter = new UserRepositoryAdapter(userModel);

      const result = await adapter.create(UsersUseCasesMother.user());

      expect(userModel.create).toHaveBeenCalledWith(
        UsersUseCasesMother.user().toPrimitives(),
      );
      expect(result.toPrimitives()).toEqual(userDto);
    });
  });

  describe('findByEmail', () => {
    it('should select passwordHash and return a domain user', async () => {
      const userModel = UserRepositoryAdapterMother.userModel();
      const query = UserRepositoryAdapterMother.findOneQuery();
      userModel.findOne.mockReturnValue(query);
      const adapter = new UserRepositoryAdapter(userModel);

      const result = await adapter.findByEmail(UsersUseCasesMother.email());

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: UsersUseCasesMother.email(),
      });
      expect(query.select).toHaveBeenCalledWith('+passwordHash');
      expect(result?.toPrimitives()).toEqual(
        UserRepositoryAdapterMother.userDto(),
      );
    });

    it('should return null when user does not exist', async () => {
      const userModel = UserRepositoryAdapterMother.userModel();
      const query = UserRepositoryAdapterMother.findOneQuery(null);
      userModel.findOne.mockReturnValue(query);
      const adapter = new UserRepositoryAdapter(userModel);

      const result = await adapter.findByEmail(UsersUseCasesMother.email());

      expect(result).toBeNull();
    });
  });
});
