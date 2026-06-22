import { UnauthorizedException } from '@nestjs/common';
import { TokenRepository } from '@shared/domain/models/gateways';
import { CryptoUtils } from '@shared/domain/use-cases/utils';
import { AuthResponse } from '@auth/domain/models/cqrs/commands';
import {
  toAuthUserResponse,
  UsersAuthGateway,
} from '@auth/domain/models/gateways';
import { AuthTokenConfig } from '@auth/domain/use-cases';

const INVALID_CREDENTIALS_MESSAGE = 'Invalid credentials';

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

  async execute(params: LoginUseCaseParams): Promise<AuthResponse> {
    const user = await this.usersAuthGateway.findUserByEmail(params.email);

    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const isValidPassword = await CryptoUtils.compareStrongHash(
      user.passwordHash,
      params.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const authUser = toAuthUserResponse(user);

    return {
      user: authUser,
      sessionToken: this.tokenRepository.sign(
        authUser,
        this.tokenConfig.sessionSecret,
        this.tokenConfig.sessionExpiresIn,
      ),
      refreshToken: this.tokenRepository.sign(
        authUser,
        this.tokenConfig.refreshSecret,
        this.tokenConfig.refreshExpiresIn,
      ),
    };
  }
}
