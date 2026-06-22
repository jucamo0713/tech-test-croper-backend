import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from '@products/domain/models/cqrs/commands';
import { DeleteProductUseCase } from '@products/domain/use-cases';

@CommandHandler(DeleteProductCommand)
export class DeleteProductCommandHandler implements ICommandHandler<
  DeleteProductCommand,
  void
> {
  constructor(private readonly deleteProductUseCase: DeleteProductUseCase) {}

  execute(command: DeleteProductCommand): Promise<void> {
    return this.deleteProductUseCase.execute(command.productId);
  }
}
