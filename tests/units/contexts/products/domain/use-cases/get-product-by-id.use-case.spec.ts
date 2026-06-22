/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
import { GetProductByIdUseCase } from '@products/domain/use-cases';
import { ProductsUseCasesMother } from '../../../../../mothers-and-mocks/contexts/products/domain/use-cases/products-use-cases.mother';

describe('GetProductByIdUseCase', () => {
  describe('execute', () => {
    it('should return product primitives when product exists', async () => {
      const repository = ProductsUseCasesMother.repository();
      repository.findById.mockResolvedValue(ProductsUseCasesMother.product());
      const useCase = new GetProductByIdUseCase(repository);

      const result = await useCase.execute(ProductsUseCasesMother.productId());

      expect(repository.findById).toHaveBeenCalledWith(
        ProductsUseCasesMother.productId(),
      );
      expect(result).toEqual(ProductsUseCasesMother.primitives());
    });

    it('should throw NotFoundException when product does not exist', async () => {
      const repository = ProductsUseCasesMother.repository();
      repository.findById.mockResolvedValue(null);
      const useCase = new GetProductByIdUseCase(repository);

      await expect(
        useCase.execute(ProductsUseCasesMother.productId()),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
