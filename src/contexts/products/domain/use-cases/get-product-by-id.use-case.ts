import { NotFoundException } from '@nestjs/common';
import { ProductPrimitives } from '@products/domain/models/entities';
import { ProductRepositoryGateway } from '@products/domain/models/gateways';
import { ProductErrorMessagesConstants } from '@products/domain/models/constants';

export class GetProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepositoryGateway) {}

  async execute(productId: string): Promise<ProductPrimitives> {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundException(
        ProductErrorMessagesConstants.PRODUCT_NOT_FOUND,
      );
    }

    return product.toPrimitives();
  }
}
