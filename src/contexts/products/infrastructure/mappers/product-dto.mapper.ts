import { Product } from '@products/domain/models/entities';
import { ProductId } from '@products/domain/models/value-objects';
import type { ProductDto } from '@products/infrastructure/dtos';

export class ProductDtoMapper {
  static toDomain(product: ProductDto): Product {
    return new Product({
      productId: new ProductId(product.productId),
      name: this.toRecord(product.name),
      description: product.description
        ? this.toRecord(product.description)
        : undefined,
      prices: this.toRecord(product.prices),
      status: product.status,
    });
  }

  static toPersistence(product: Product): ProductDto {
    return product.toPrimitives();
  }

  private static toRecord<TValue>(
    value: Partial<Record<string, TValue>> | Map<string, TValue>,
  ): Partial<Record<string, TValue>> {
    if (value instanceof Map) {
      return Object.fromEntries(value.entries());
    }

    return { ...value };
  }
}
