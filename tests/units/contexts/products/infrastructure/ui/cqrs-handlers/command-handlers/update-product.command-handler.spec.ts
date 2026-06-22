import { UpdateProductCommand } from '@products/domain/models/cqrs/commands';
import { UpdateProductCommandHandler } from '@products/infrastructure/ui/cqrs-handlers/command-handlers';
import { ProductsUseCasesMother } from '../../../../../../../mothers-and-mocks/contexts/products/domain/use-cases/products-use-cases.mother';

describe('UpdateProductCommandHandler', () => {
  describe('execute', () => {
    it('should call UpdateProductUseCase', async () => {
      const useCase = { execute: jest.fn() };
      useCase.execute.mockResolvedValue(ProductsUseCasesMother.primitives());
      const handler = new UpdateProductCommandHandler(useCase);
      const command = new UpdateProductCommand(
        ProductsUseCasesMother.productId(),
        ProductsUseCasesMother.updatePayload(),
      );

      const result = await handler.execute(command);

      expect(useCase.execute).toHaveBeenCalledWith(
        command.productId,
        command.payload,
      );
      expect(result).toEqual(ProductsUseCasesMother.primitives());
    });
  });
});
