import { Command } from '@nestjs/cqrs';
import type { AuthResponse } from '@auth/domain/models/cqrs/commands';

export class LoginCommand extends Command<AuthResponse> {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {
    super();
  }
}
