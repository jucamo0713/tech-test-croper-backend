import {
  AuthResponse,
  AuthUserOnlyResponse,
  LoginCommand,
  RegisterCommand,
} from '@auth/domain/models/cqrs/commands';
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

  static authResponse(): AuthResponse {
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

  static authResponseWithoutTokens(): AuthUserOnlyResponse {
    return {
      user: AuthUseCasesMother.authResponse().user,
    };
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
      verify: jest.fn(),
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

  static usersAuthGateway(): jest.Mocked<UsersAuthGateway> {
    return {
      createUser: jest.fn(),
      findUserByEmail: jest.fn(),
    };
  }
}
