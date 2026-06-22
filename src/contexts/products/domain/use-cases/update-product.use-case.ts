import { NotFoundException } from '@nestjs/common';
import { Product, ProductPrimitives } from '@products/domain/models/entities';
import { ProductRepositoryGateway } from '@products/domain/models/gateways';
import { ProductId } from '@products/domain/models/value-objects';
import { ProductErrorMessagesConstants } from '@products/domain/models/constants';
import type { UpdateProductCommandPayload } from '@products/domain/models/cqrs/commands';

export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryGateway) {}

  async execute(
    productId: string,
    params: UpdateProductCommandPayload,
  ): Promise<ProductPrimitives> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException(
        ProductErrorMessagesConstants.PRODUCT_NOT_FOUND,
      );
    }

    const primitives = product.toPrimitives();
    const updatedProduct = new Product({
      productId: new ProductId(primitives.productId),
      name: params.name ?? product.name,
      description: params.description ?? product.description,
      prices: params.prices ?? product.prices,
      status: params.status ?? product.status,
    });

    const updated = await this.productRepository.update(
      productId,
      updatedProduct,
    );

    if (!updated) {
      throw new NotFoundException(
        ProductErrorMessagesConstants.PRODUCT_NOT_FOUND,
      );
    }

    return updated.toPrimitives();
  }
}
