import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from '@products/domain/models/cqrs/commands';
import { ProductPrimitives } from '@products/domain/models/entities';
import { CreateProductUseCase } from '@products/domain/use-cases';

@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler implements ICommandHandler<
  CreateProductCommand,
  ProductPrimitives
> {
  constructor(private readonly createProductUseCase: CreateProductUseCase) {}

  execute(command: CreateProductCommand): Promise<ProductPrimitives> {
    return this.createProductUseCase.execute(command.payload);
  }
}
