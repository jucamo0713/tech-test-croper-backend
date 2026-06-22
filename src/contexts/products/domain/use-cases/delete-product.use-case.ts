import { NotFoundException } from '@nestjs/common';
import { ProductRepositoryGateway } from '@products/domain/models/gateways';
import { ProductErrorMessagesConstants } from '@products/domain/models/constants';

export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryGateway) {}

  async execute(productId: string): Promise<void> {
    const deleted = await this.productRepository.delete(productId);

    if (!deleted) {
      throw new NotFoundException(
        ProductErrorMessagesConstants.PRODUCT_NOT_FOUND,
      );
    }
  }
}
