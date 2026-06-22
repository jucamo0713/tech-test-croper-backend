import { UnauthorizedException } from '@nestjs/common';
import { TokenRepository } from '@shared/domain/models/gateways';
import { CryptoUtils } from '@shared/domain/use-cases/utils';
import { UsersAuthGateway } from '@auth/domain/models/gateways';
import {
  AuthSession,
  AuthUser,
  type AuthSessionPrimitives,
} from '@auth/domain/models/entities';
import { AuthTokenConfig } from '@auth/domain';
import { AuthErrorMessagesConstants } from '@auth/domain/models/constants';

export interface LoginUseCaseParams {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private readonly usersAuthGateway: UsersAuthGateway,
    private readonly tokenRepository: TokenRepository,
    private readonly tokenConfig: AuthTokenConfig,
  ) {}

  async execute(params: LoginUseCaseParams): Promise<AuthSessionPrimitives> {
    const user = await this.usersAuthGateway.findUserByEmail(params.email);

    if (!user) {
      throw new UnauthorizedException(
        AuthErrorMessagesConstants.INVALID_CREDENTIALS,
      );
    }

    const isValidPassword = await CryptoUtils.compareStrongHash(
      user.passwordHash,
      params.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException(
        AuthErrorMessagesConstants.INVALID_CREDENTIALS,
      );
    }

    const authUser = new AuthUser({
      userId: user.userId,
      email: user.email,
      status: user.status,
    });

    return this.createSession(authUser).toPrimitives();
  }

  private createSession(user: AuthUser): AuthSession {
    const tokenPayload = user.toPrimitives();

    return new AuthSession({
      user,
      sessionToken: this.tokenRepository.sign(
        tokenPayload,
        this.tokenConfig.sessionSecret,
        this.tokenConfig.sessionExpiresIn,
      ),
      refreshToken: this.tokenRepository.sign(
        tokenPayload,
        this.tokenConfig.refreshSecret,
        this.tokenConfig.refreshExpiresIn,
      ),
    });
  }
}
