import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProductCommand } from '@products/domain/models/cqrs/commands';
import { ProductPrimitives } from '@products/domain/models/entities';
import { UpdateProductUseCase } from '@products/domain/use-cases';

@CommandHandler(UpdateProductCommand)
export class UpdateProductCommandHandler implements ICommandHandler<
  UpdateProductCommand,
  ProductPrimitives
> {
  constructor(private readonly updateProductUseCase: UpdateProductUseCase) {}

  execute(command: UpdateProductCommand): Promise<ProductPrimitives> {
    return this.updateProductUseCase.execute(
      command.productId,
      command.payload,
    );
  }
}
