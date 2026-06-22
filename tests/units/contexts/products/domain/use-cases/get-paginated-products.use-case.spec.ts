/* eslint-disable @typescript-eslint/unbound-method */
import { CurrencyConstants } from '@shared/domain/models/constants';
import { GetPaginatedProductsUseCase } from '@products/domain/use-cases';
import { ProductsUseCasesMother } from '../../../../../mothers-and-mocks/contexts/products/domain/use-cases/products-use-cases.mother';

describe('GetPaginatedProductsUseCase', () => {
  describe('execute', () => {
    it('should call ProductRepositoryGateway with page, limit and filters', async () => {
      const repository = ProductsUseCasesMother.repository();
      repository.findPaginated.mockResolvedValue(
        ProductsUseCasesMother.paginatedResult(),
      );
      const useCase = new GetPaginatedProductsUseCase(repository);

      const result = await useCase.execute({
        page: 2,
        limit: 20,
        filters: {
          search: 'coffee',
          currency: CurrencyConstants.USD,
        },
      });

      expect(repository.findPaginated).toHaveBeenCalledWith({
        page: 2,
        limit: 20,
        sortBy: undefined,
        sortOrder: undefined,
        filters: {
          search: 'coffee',
          currency: CurrencyConstants.USD,
        },
      });
      expect(result.data).toEqual([ProductsUseCasesMother.primitives()]);
      expect(result.metadata).toEqual(
        ProductsUseCasesMother.paginatedResult().metadata,
      );
    });

    it('should apply default page and limit when values are not provided', async () => {
      const repository = ProductsUseCasesMother.repository();
      repository.findPaginated.mockResolvedValue(
        ProductsUseCasesMother.paginatedResult(),
      );
      const useCase = new GetPaginatedProductsUseCase(repository);

      await useCase.execute({});

      expect(repository.findPaginated).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        sortBy: undefined,
        sortOrder: undefined,
        filters: {},
      });
    });

    it('should cap limit to the maximum allowed value', async () => {
      const repository = ProductsUseCasesMother.repository();
      repository.findPaginated.mockResolvedValue(
        ProductsUseCasesMother.paginatedResult(),
      );
      const useCase = new GetPaginatedProductsUseCase(repository);

      await useCase.execute({ limit: 500 });

      expect(repository.findPaginated).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 100 }),
      );
    });
  });
});
