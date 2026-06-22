import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthResponse, LoginCommand } from '@auth/domain/models/cqrs/commands';
import { LoginUseCase } from '@auth/domain/use-cases';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<
  LoginCommand,
  AuthResponse
> {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  execute(command: LoginCommand): Promise<AuthResponse> {
    return this.loginUseCase.execute({
      email: command.email,
      password: command.password,
    });
  }
}
