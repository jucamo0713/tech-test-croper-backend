import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Pagination } from '@shared/domain/models/entities';
import { ProductPrimitives } from '@products/domain/models/entities';
import { GetPaginatedProductsQuery } from '@products/domain/models/cqrs/queries';
import { GetPaginatedProductsUseCase } from '@products/domain/use-cases';

@QueryHandler(GetPaginatedProductsQuery)
export class GetPaginatedProductsQueryHandler implements IQueryHandler<
  GetPaginatedProductsQuery,
  Pagination<ProductPrimitives>
> {
  constructor(
    private readonly getPaginatedProductsUseCase: GetPaginatedProductsUseCase,
  ) {}

  execute(
    query: GetPaginatedProductsQuery,
  ): Promise<Pagination<ProductPrimitives>> {
    return this.getPaginatedProductsUseCase.execute(query.criteria);
  }
}
