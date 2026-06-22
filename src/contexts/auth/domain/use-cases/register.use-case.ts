import { CryptoUtils } from '@shared/domain/use-cases/utils';
import { TokenRepository } from '@shared/domain/models/gateways';
import { AuthResponse } from '@auth/domain/models/cqrs/commands';
import { UsersAuthGateway } from '@auth/domain/models/gateways';
import { AuthTokenConfig } from '@auth/domain/use-cases';

export interface RegisterUseCaseParams {
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(
    private readonly usersAuthGateway: UsersAuthGateway,
    private readonly tokenRepository: TokenRepository,
    private readonly tokenConfig: AuthTokenConfig,
  ) {}

  async execute(params: RegisterUseCaseParams): Promise<AuthResponse> {
    const passwordHash = await CryptoUtils.strongHash(params.password);

    const response = await this.usersAuthGateway.createUser({
      email: params.email,
      passwordHash,
    });

    return {
      ...response,
      ...this.createTokens(response.user),
    };
  }

  private createTokens(
    user: AuthResponse['user'],
  ): Pick<AuthResponse, 'sessionToken' | 'refreshToken'> {
    return {
      sessionToken: this.tokenRepository.sign(
        user,
        this.tokenConfig.sessionSecret,
        this.tokenConfig.sessionExpiresIn,
      ),
      refreshToken: this.tokenRepository.sign(
        user,
        this.tokenConfig.refreshSecret,
        this.tokenConfig.refreshExpiresIn,
      ),
    };
  }
}
