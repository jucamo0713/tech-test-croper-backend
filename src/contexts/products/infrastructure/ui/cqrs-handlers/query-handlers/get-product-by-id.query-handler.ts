import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductByIdQuery } from '@products/domain/models/cqrs/queries';
import { ProductPrimitives } from '@products/domain/models/entities';
import { GetProductByIdUseCase } from '@products/domain/use-cases';

@QueryHandler(GetProductByIdQuery)
export class GetProductByIdQueryHandler implements IQueryHandler<
  GetProductByIdQuery,
  ProductPrimitives
> {
  constructor(private readonly getProductByIdUseCase: GetProductByIdUseCase) {}

  execute(query: GetProductByIdQuery): Promise<ProductPrimitives> {
    return this.getProductByIdUseCase.execute(query.productId);
  }
}
