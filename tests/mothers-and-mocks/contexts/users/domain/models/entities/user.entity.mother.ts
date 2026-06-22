import { UserProps } from '@users/domain/models/entities';
import {
  Email,
  IdValueObject,
} from '@shared/domain/models/value-objects/string';

class TestUserId extends IdValueObject {}

export class UserMother {
  static props(): UserProps {
    return {
      userId: new TestUserId('user-id'),
      email: new Email('user@test.com'),
      password: 'hashed-password',
      status: 'active',
    };
  }
}
