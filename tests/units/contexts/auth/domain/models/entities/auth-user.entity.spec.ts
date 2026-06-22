import { AuthUser } from '@auth/domain/models/entities';
import { AuthUseCasesMother } from '../../../../../../mothers-and-mocks/contexts/auth/domain/use-cases/auth-use-cases.mother';

describe('AuthUser', () => {
  describe('constructor', () => {
    it('should create an auth user with valid props', () => {
      const props = AuthUseCasesMother.authUserPrimitives();

      const user = new AuthUser(props);

      expect(user.userId).toBe(props.userId);
      expect(user.email).toBe(props.email);
      expect(user.status).toBe(props.status);
    });
  });

  describe('toPrimitives', () => {
    it('should return auth user primitive values', () => {
      const props = AuthUseCasesMother.authUserPrimitives();
      const user = new AuthUser(props);

      expect(user.toPrimitives()).toEqual(props);
    });
  });
});
