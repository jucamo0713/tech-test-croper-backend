import { AuthSession } from '@auth/domain/models/entities';
import { AuthUseCasesMother } from '../../../../../../mothers-and-mocks/contexts/auth/domain/use-cases/auth-use-cases.mother';

describe('AuthSession', () => {
  describe('constructor', () => {
    it('should create an auth session with valid props', () => {
      const user = AuthUseCasesMother.authUser();

      const session = new AuthSession({
        user,
        sessionToken: AuthUseCasesMother.sessionToken(),
        refreshToken: AuthUseCasesMother.refreshToken(),
      });

      expect(session.user).toBe(user);
      expect(session.sessionToken).toBe(AuthUseCasesMother.sessionToken());
      expect(session.refreshToken).toBe(AuthUseCasesMother.refreshToken());
    });
  });

  describe('toPrimitives', () => {
    it('should return auth session primitive values', () => {
      const session = new AuthSession({
        user: AuthUseCasesMother.authUser(),
        sessionToken: AuthUseCasesMother.sessionToken(),
        refreshToken: AuthUseCasesMother.refreshToken(),
      });

      expect(session.toPrimitives()).toEqual(AuthUseCasesMother.authResponse());
    });
  });
});
