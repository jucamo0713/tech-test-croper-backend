import { Query } from '@nestjs/cqrs';
import { Pagination } from '@shared/domain/models/entities';
import type { ProductPrimitives } from '@products/domain/models/entities';
import type { ProductPaginationCriteria } from '@products/domain/models/gateways';

export class GetPaginatedProductsQuery extends Query<
  Pagination<ProductPrimitives>
> {
  constructor(public readonly criteria: ProductPaginationCriteria) {
    super();
  }
}
