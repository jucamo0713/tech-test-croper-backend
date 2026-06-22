import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from '@auth/domain/models/cqrs/commands';
import type { AuthSessionPrimitives } from '@auth/domain/models/entities';
import { RegisterUseCase } from '@auth/domain/use-cases';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler<
  RegisterCommand,
  AuthSessionPrimitives
> {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  execute(command: RegisterCommand): Promise<AuthSessionPrimitives> {
    return this.registerUseCase.execute({
      email: command.email,
      password: command.password,
    });
  }
}
