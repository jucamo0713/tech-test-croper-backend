import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import type { EnvironmentVariables } from '@shared/application/config';
import { TokenRepositoryToken } from '@shared/domain/models/gateways';
import type { TokenRepository } from '@shared/domain/models/gateways';
import { PrimitiveObject } from '@shared/domain/models/types';

export interface AuthenticatedRequest extends Request {
  user?: PrimitiveObject;
}

@Injectable()
export class JwtSessionGuard implements CanActivate {
  constructor(
    @Inject(TokenRepositoryToken)
    private readonly tokenRepository: TokenRepository,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request);

    if (!token) {
      throw new UnauthorizedException('Invalid session token');
    }

    const payload = this.tokenRepository.verify<PrimitiveObject>(
      token,
      this.configService.getOrThrow('SESSION_TOKEN_SECRET', { infer: true }),
    );

    if (!payload) {
      throw new UnauthorizedException('Invalid session token');
    }

    request.user = payload;

    return true;
  }

  private extractBearerToken(request: Request): string | undefined {
    const authorization = request.headers.authorization;

    if (!authorization) {
      return undefined;
    }

    const [type, token] = authorization.split(' ');

    return type === 'Bearer' ? token : undefined;
  }
}
