import { GetPaginatedProductsQuery } from '@products/domain/models/cqrs/queries';
import { GetPaginatedProductsQueryHandler } from '@products/infrastructure/ui/cqrs-handlers/query-handlers';
import { ProductsUseCasesMother } from '../../../../../../../mothers-and-mocks/contexts/products/domain/use-cases/products-use-cases.mother';

describe('GetPaginatedProductsQueryHandler', () => {
  describe('execute', () => {
    it('should call GetPaginatedProductsUseCase', async () => {
      const useCase = { execute: jest.fn() };
      useCase.execute.mockResolvedValue(
        ProductsUseCasesMother.paginatedResult(),
      );
      const handler = new GetPaginatedProductsQueryHandler(useCase);
      const query = new GetPaginatedProductsQuery({ page: 1, limit: 10 });

      const result = await handler.execute(query);

      expect(useCase.execute).toHaveBeenCalledWith(query.criteria);
      expect(result).toEqual(ProductsUseCasesMother.paginatedResult());
    });
  });
});
