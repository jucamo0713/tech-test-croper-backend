/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
import { UpdateProductUseCase } from '@products/domain/use-cases';
import { ProductsUseCasesMother } from '../../../../../mothers-and-mocks/contexts/products/domain/use-cases/products-use-cases.mother';

describe('UpdateProductUseCase', () => {
  describe('execute', () => {
    it('should partially update a product through the repository gateway', async () => {
      const repository = ProductsUseCasesMother.repository();
      repository.findById.mockResolvedValue(ProductsUseCasesMother.product());
      repository.update.mockResolvedValue(ProductsUseCasesMother.product());
      const useCase = new UpdateProductUseCase(repository);

      const result = await useCase.execute(
        ProductsUseCasesMother.productId(),
        ProductsUseCasesMother.updatePayload(),
      );

      expect(repository.findById).toHaveBeenCalledWith(
        ProductsUseCasesMother.productId(),
      );
      expect(repository.update).toHaveBeenCalled();
      expect(result).toEqual(ProductsUseCasesMother.primitives());
    });

    it('should throw NotFoundException when product does not exist', async () => {
      const repository = ProductsUseCasesMother.repository();
      repository.findById.mockResolvedValue(null);
      const useCase = new UpdateProductUseCase(repository);

      await expect(
        useCase.execute(
          ProductsUseCasesMother.productId(),
          ProductsUseCasesMother.updatePayload(),
        ),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });
});
