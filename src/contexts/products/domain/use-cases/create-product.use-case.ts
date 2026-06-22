import { Product, ProductPrimitives } from '@products/domain/models/entities';
import { ProductRepositoryGateway } from '@products/domain/models/gateways';
import { ProductId } from '@products/domain/models/value-objects';
import type { CreateProductCommandPayload } from '@products/domain/models/cqrs/commands';

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryGateway) {}

  async execute(
    params: CreateProductCommandPayload,
  ): Promise<ProductPrimitives> {
    const product = new Product({
      productId: ProductId.generateInstance(),
      name: params.name,
      description: params.description,
      prices: params.prices,
      status: params.status,
    });

    return (await this.productRepository.create(product)).toPrimitives();
  }
}
