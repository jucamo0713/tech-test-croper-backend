import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreateUserCommand,
  CreateUserCommandResult,
} from '@users/domain/models/cqrs/commands';
import { CreateUserUseCase } from '@users/domain/use-cases';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<
  CreateUserCommand,
  CreateUserCommandResult
> {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  execute(command: CreateUserCommand): Promise<CreateUserCommandResult> {
    return this.createUserUseCase.execute({
      email: command.email,
      passwordHash: command.passwordHash,
      status: command.status,
    });
  }
}
