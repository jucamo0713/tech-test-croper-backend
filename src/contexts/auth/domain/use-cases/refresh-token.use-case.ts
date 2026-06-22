import { UnauthorizedException } from '@nestjs/common';
import { TokenRepository } from '@shared/domain/models/gateways';
import { PrimitiveObject } from '@shared/domain/models/types';
import { AuthErrorMessagesConstants } from '@auth/domain/models/constants';
import {
  AuthSession,
  AuthUser,
  type AuthSessionPrimitives,
  type AuthUserPrimitives,
} from '@auth/domain/models/entities';
import { AuthTokenConfig } from '@auth/domain';

export interface RefreshTokenUseCaseParams {
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly tokenConfig: AuthTokenConfig,
  ) {}

  execute(params: RefreshTokenUseCaseParams): AuthSessionPrimitives {
    const payload = this.tokenRepository.verify<PrimitiveObject>(
      params.refreshToken,
      this.tokenConfig.refreshSecret,
    );

    const authUserPrimitives = this.toAuthUserPrimitives(payload);

    if (!authUserPrimitives) {
      throw new UnauthorizedException(
        AuthErrorMessagesConstants.INVALID_REFRESH_TOKEN,
      );
    }

    return this.createSession(new AuthUser(authUserPrimitives)).toPrimitives();
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

  private toAuthUserPrimitives(
    payload: PrimitiveObject | undefined,
  ): AuthUserPrimitives | undefined {
    if (!payload) {
      return undefined;
    }

    const record = payload as Record<string, unknown>;

    if (
      typeof record.userId !== 'string' ||
      typeof record.email !== 'string' ||
      (record.status !== undefined && typeof record.status !== 'string')
    ) {
      return undefined;
    }

    return {
      userId: record.userId,
      email: record.email,
      status: record.status,
    };
  }
}
