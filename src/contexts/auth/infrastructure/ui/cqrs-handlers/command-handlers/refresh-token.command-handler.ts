import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshTokenCommand } from '@auth/domain/models/cqrs/commands';
import type { AuthSessionPrimitives } from '@auth/domain/models/entities';
import { RefreshTokenUseCase } from '@auth/domain/use-cases';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler implements ICommandHandler<
  RefreshTokenCommand,
  AuthSessionPrimitives
> {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  execute(command: RefreshTokenCommand): Promise<AuthSessionPrimitives> {
    return Promise.resolve(
      this.refreshTokenUseCase.execute({
        refreshToken: command.refreshToken,
      }),
    );
  }
}
