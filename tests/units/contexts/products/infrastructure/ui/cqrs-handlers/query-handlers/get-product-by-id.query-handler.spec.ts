import { GetProductByIdQuery } from '@products/domain/models/cqrs/queries';
import { GetProductByIdQueryHandler } from '@products/infrastructure/ui/cqrs-handlers/query-handlers';
import { ProductsUseCasesMother } from '../../../../../../../mothers-and-mocks/contexts/products/domain/use-cases/products-use-cases.mother';

describe('GetProductByIdQueryHandler', () => {
  describe('execute', () => {
    it('should call GetProductByIdUseCase', async () => {
      const useCase = { execute: jest.fn() };
      useCase.execute.mockResolvedValue(ProductsUseCasesMother.primitives());
      const handler = new GetProductByIdQueryHandler(useCase);
      const query = new GetProductByIdQuery(ProductsUseCasesMother.productId());

      const result = await handler.execute(query);

      expect(useCase.execute).toHaveBeenCalledWith(query.productId);
      expect(result).toEqual(ProductsUseCasesMother.primitives());
    });
  });
});
