import { Command } from '@nestjs/cqrs';

export interface CreateUserCommandResult {
  userId: string;
  email: string;
  status?: string;
}

export class CreateUserCommand extends Command<CreateUserCommandResult> {
  constructor(
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly status?: string,
  ) {
    super();
  }
}
