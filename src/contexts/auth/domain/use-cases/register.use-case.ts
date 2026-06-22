import { CryptoUtils } from '@shared/domain/use-cases/utils';
import { TokenRepository } from '@shared/domain/models/gateways';
import { UsersAuthGateway } from '@auth/domain/models/gateways';
import {
  AuthSession,
  AuthUser,
  type AuthSessionPrimitives,
} from '@auth/domain/models/entities';
import { AuthTokenConfig } from '@auth/domain';

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

  async execute(params: RegisterUseCaseParams): Promise<AuthSessionPrimitives> {
    const passwordHash = await CryptoUtils.strongHash(params.password);

    const user = await this.usersAuthGateway.createUser({
      email: params.email,
      passwordHash,
    });

    return this.createSession(user).toPrimitives();
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
