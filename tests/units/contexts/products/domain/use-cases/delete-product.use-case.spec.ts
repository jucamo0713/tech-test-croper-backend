/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
import { DeleteProductUseCase } from '@products/domain/use-cases';
import { ProductsUseCasesMother } from '../../../../../mothers-and-mocks/contexts/products/domain/use-cases/products-use-cases.mother';

describe('DeleteProductUseCase', () => {
  describe('execute', () => {
    it('should delete a product through the repository gateway', async () => {
      const repository = ProductsUseCasesMother.repository();
      repository.delete.mockResolvedValue(true);
      const useCase = new DeleteProductUseCase(repository);

      await useCase.execute(ProductsUseCasesMother.productId());

      expect(repository.delete).toHaveBeenCalledWith(
        ProductsUseCasesMother.productId(),
      );
    });

    it('should throw NotFoundException when product does not exist', async () => {
      const repository = ProductsUseCasesMother.repository();
      repository.delete.mockResolvedValue(false);
      const useCase = new DeleteProductUseCase(repository);

      await expect(
        useCase.execute(ProductsUseCasesMother.productId()),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
