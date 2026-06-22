import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '@shared/application/config';
import {
  TokenRepository,
  TokenRepositoryToken,
} from '@shared/domain/models/gateways';
import {
  UsersAuthGateway,
  UsersAuthGatewayToken,
} from '@auth/domain/models/gateways';
import {
  AuthTokenConfig,
  LoginUseCase,
  RefreshTokenUseCase,
  RegisterUseCase,
} from '@auth/domain/use-cases';

const createAuthTokenConfig = (
  configService: ConfigService<EnvironmentVariables, true>,
): AuthTokenConfig => ({
  sessionSecret: configService.getOrThrow('SESSION_TOKEN_SECRET', {
    infer: true,
  }),
  sessionExpiresIn: configService.getOrThrow(
    'SESSION_TOKEN_EXPIRES_IN_SECONDS',
    {
      infer: true,
    },
  ),
  refreshSecret: configService.getOrThrow('REFRESH_TOKEN_SECRET', {
    infer: true,
  }),
  refreshExpiresIn: configService.getOrThrow(
    'REFRESH_TOKEN_EXPIRES_IN_SECONDS',
    {
      infer: true,
    },
  ),
});

export const UseCaseProviders = [
  {
    provide: RegisterUseCase,
    inject: [UsersAuthGatewayToken, TokenRepositoryToken, ConfigService],
    useFactory: (
      usersAuthGateway: UsersAuthGateway,
      tokenRepository: TokenRepository,
      configService: ConfigService<EnvironmentVariables, true>,
    ): RegisterUseCase =>
      new RegisterUseCase(
        usersAuthGateway,
        tokenRepository,
        createAuthTokenConfig(configService),
      ),
  },
  {
    provide: LoginUseCase,
    inject: [UsersAuthGatewayToken, TokenRepositoryToken, ConfigService],
    useFactory: (
      usersAuthGateway: UsersAuthGateway,
      tokenRepository: TokenRepository,
      configService: ConfigService<EnvironmentVariables, true>,
    ): LoginUseCase =>
      new LoginUseCase(
        usersAuthGateway,
        tokenRepository,
        createAuthTokenConfig(configService),
      ),
  },
  {
    provide: RefreshTokenUseCase,
    inject: [TokenRepositoryToken, ConfigService],
    useFactory: (
      tokenRepository: TokenRepository,
      configService: ConfigService<EnvironmentVariables, true>,
    ): RefreshTokenUseCase =>
      new RefreshTokenUseCase(
        tokenRepository,
        createAuthTokenConfig(configService),
      ),
  },
];
