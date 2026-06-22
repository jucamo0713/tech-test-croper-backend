import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  AuthResponse,
  RegisterCommand,
} from '@auth/domain/models/cqrs/commands';
import { RegisterUseCase } from '@auth/domain/use-cases';

@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler<
  RegisterCommand,
  AuthResponse
> {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  execute(command: RegisterCommand): Promise<AuthResponse> {
    return this.registerUseCase.execute({
      email: command.email,
      password: command.password,
    });
  }
}
