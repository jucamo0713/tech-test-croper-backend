import { Command } from '@nestjs/cqrs';
import type { AuthSessionPrimitives } from '@auth/domain/models/entities';

export class RefreshTokenCommand extends Command<AuthSessionPrimitives> {
  constructor(public readonly refreshToken: string) {
    super();
  }
}
