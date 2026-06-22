import { Query } from '@nestjs/cqrs';
import type { ProductPrimitives } from '@products/domain/models/entities';

export class GetProductByIdQuery extends Query<ProductPrimitives> {
  constructor(public readonly productId: string) {
    super();
  }
}
