import { User } from '@users/domain/models/entities';
import { UserMother } from '../../../../../../mothers-and-mocks/contexts/users/domain/models/entities/user.entity.mother';

describe('User', () => {
  describe('constructor', () => {
    it('should create a user with valid props', () => {
      const props = UserMother.props();

      const user = new User(props);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(props.userId);
      expect(user.email).toBe(props.email);
      expect(user.password).toBe(props.password);
      expect(user.status).toBe(props.status);
    });
  });

  describe('toPrimitives', () => {
    it('should return user primitive values', () => {
      const props = UserMother.props();
      const user = new User(props);

      expect(user.toPrimitives()).toEqual({
        userId: props.userId.toString(),
        email: props.email.toString(),
        password: props.password,
        status: props.status,
      });
    });
  });
});
