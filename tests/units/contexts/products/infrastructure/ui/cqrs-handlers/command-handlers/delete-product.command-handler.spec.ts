import { DeleteProductCommand } from '@products/domain/models/cqrs/commands';
import { DeleteProductCommandHandler } from '@products/infrastructure/ui/cqrs-handlers/command-handlers';
import { ProductsUseCasesMother } from '../../../../../../../mothers-and-mocks/contexts/products/domain/use-cases/products-use-cases.mother';

describe('DeleteProductCommandHandler', () => {
  describe('execute', () => {
    it('should call DeleteProductUseCase', async () => {
      const useCase = { execute: jest.fn() };
      useCase.execute.mockResolvedValue(undefined);
      const handler = new DeleteProductCommandHandler(useCase);
      const command = new DeleteProductCommand(
        ProductsUseCasesMother.productId(),
      );

      await handler.execute(command);

      expect(useCase.execute).toHaveBeenCalledWith(command.productId);
    });
  });
});
