import {
  LoginCommand,
  RefreshTokenCommand,
  RegisterCommand,
} from '@auth/domain/models/cqrs/commands';
import {
  AuthSessionPrimitives,
  AuthUser,
  AuthUserPrimitives,
} from '@auth/domain/models/entities';
import {
  UserForAuthentication,
  UsersAuthGateway,
} from '@auth/domain/models/gateways';
import { AuthTokenConfig } from '@auth/domain/use-cases';
import { TokenRepository } from '@shared/domain/models/gateways';

export class AuthUseCasesMother {
  static email(): string {
    return 'user@test.com';
  }

  static password(): string {
    return 'plain-password';
  }

  static passwordHash(): string {
    return 'hashed-password';
  }

  static authResponse(): AuthSessionPrimitives {
    return {
      user: {
        userId: 'user-id',
        email: AuthUseCasesMother.email(),
        status: 'active',
      },
      sessionToken: AuthUseCasesMother.sessionToken(),
      refreshToken: AuthUseCasesMother.refreshToken(),
    };
  }

  static authUserPrimitives(): AuthUserPrimitives {
    return AuthUseCasesMother.authResponse().user;
  }

  static authUser(): AuthUser {
    return new AuthUser(AuthUseCasesMother.authUserPrimitives());
  }

  static sessionToken(): string {
    return 'session-token';
  }

  static refreshToken(): string {
    return 'refresh-token';
  }

  static tokenConfig(): AuthTokenConfig {
    return {
      sessionSecret: 'session-secret-minimum-32-characters',
      sessionExpiresIn: 900,
      refreshSecret: 'refresh-secret-minimum-32-characters',
      refreshExpiresIn: 604800,
    };
  }

  static tokenRepository(): jest.Mocked<TokenRepository> {
    return {
      sign: jest
        .fn()
        .mockReturnValueOnce(AuthUseCasesMother.sessionToken())
        .mockReturnValueOnce(AuthUseCasesMother.refreshToken()),
      verify: jest
        .fn()
        .mockReturnValue(AuthUseCasesMother.authUserPrimitives()),
    };
  }

  static userForAuthentication(): UserForAuthentication {
    return {
      ...AuthUseCasesMother.authResponse().user,
      passwordHash: AuthUseCasesMother.passwordHash(),
    };
  }

  static registerCommand(): RegisterCommand {
    return new RegisterCommand(
      AuthUseCasesMother.email(),
      AuthUseCasesMother.password(),
    );
  }

  static loginCommand(): LoginCommand {
    return new LoginCommand(
      AuthUseCasesMother.email(),
      AuthUseCasesMother.password(),
    );
  }

  static refreshTokenCommand(): RefreshTokenCommand {
    return new RefreshTokenCommand(AuthUseCasesMother.refreshToken());
  }

  static usersAuthGateway(): jest.Mocked<UsersAuthGateway> {
    return {
      createUser: jest.fn(),
      findUserByEmail: jest.fn(),
    };
  }
}
