import { Command } from '@nestjs/cqrs';
import type { AuthSessionPrimitives } from '@auth/domain/models/entities';

export class RegisterCommand extends Command<AuthSessionPrimitives> {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {
    super();
  }
}
