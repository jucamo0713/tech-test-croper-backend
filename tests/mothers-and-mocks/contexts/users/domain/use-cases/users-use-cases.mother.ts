import { User } from '@users/domain/models/entities';
import { UserRepositoryGateway } from '@users/domain/models/gateways';
import { UserMother } from '../models/entities/user.entity.mother';

export class UsersUseCasesMother {
  static email(): string {
    return 'user@test.com';
  }

  static passwordHash(): string {
    return 'hashed-password';
  }

  static user(): User {
    return new User(UserMother.props());
  }

  static repository(): jest.Mocked<UserRepositoryGateway> {
    return {
      create: jest.fn(),
      findByEmail: jest.fn(),
    };
  }
}
