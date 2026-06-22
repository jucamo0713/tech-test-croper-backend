/* eslint-disable @typescript-eslint/unbound-method */
import { CreateProductUseCase } from '@products/domain/use-cases';
import { ProductsUseCasesMother } from '../../../../../mothers-and-mocks/contexts/products/domain/use-cases/products-use-cases.mother';

describe('CreateProductUseCase', () => {
  describe('execute', () => {
    it('should create a product through the repository gateway', async () => {
      const repository = ProductsUseCasesMother.repository();
      repository.create.mockResolvedValue(ProductsUseCasesMother.product());
      const useCase = new CreateProductUseCase(repository);

      const result = await useCase.execute(
        ProductsUseCasesMother.createPayload(),
      );

      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual(ProductsUseCasesMother.primitives());
    });
  });
});
