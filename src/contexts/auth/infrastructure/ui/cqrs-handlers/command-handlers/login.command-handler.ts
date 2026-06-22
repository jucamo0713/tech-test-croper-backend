import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '@auth/domain/models/cqrs/commands';
import type { AuthSessionPrimitives } from '@auth/domain/models/entities';
import { LoginUseCase } from '@auth/domain/use-cases';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<
  LoginCommand,
  AuthSessionPrimitives
> {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  execute(command: LoginCommand): Promise<AuthSessionPrimitives> {
    return this.loginUseCase.execute({
      email: command.email,
      password: command.password,
    });
  }
}
