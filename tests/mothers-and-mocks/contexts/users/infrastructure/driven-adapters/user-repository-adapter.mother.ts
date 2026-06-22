import { UserDto } from '@users/infrastructure/dtos';
import { Model } from 'mongoose';

export class UserRepositoryAdapterMother {
  static userDto(): UserDto {
    return {
      userId: 'user-id',
      email: 'user@test.com',
      passwordHash: 'hashed-password',
      status: 'active',
    };
  }

  static userModel(): jest.Mocked<Pick<Model<UserDto>, 'create' | 'findOne'>> {
    return {
      create: jest.fn(),
      findOne: jest.fn(),
    };
  }

  static createdDocument(
    user: UserDto = UserRepositoryAdapterMother.userDto(),
  ) {
    return {
      toObject: jest.fn(() => user),
    };
  }

  static findOneQuery(
    user: UserDto | null = UserRepositoryAdapterMother.userDto(),
  ) {
    return {
      select: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(user),
    };
  }
}
