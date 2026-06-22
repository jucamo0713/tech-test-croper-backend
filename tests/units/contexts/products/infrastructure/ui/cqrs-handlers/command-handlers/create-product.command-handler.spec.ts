import { CreateProductCommand } from '@products/domain/models/cqrs/commands';
import { CreateProductCommandHandler } from '@products/infrastructure/ui/cqrs-handlers/command-handlers';
import { ProductsUseCasesMother } from '../../../../../../../mothers-and-mocks/contexts/products/domain/use-cases/products-use-cases.mother';

describe('CreateProductCommandHandler', () => {
  describe('execute', () => {
    it('should call CreateProductUseCase', async () => {
      const useCase = { execute: jest.fn() };
      useCase.execute.mockResolvedValue(ProductsUseCasesMother.primitives());
      const handler = new CreateProductCommandHandler(useCase);
      const command = new CreateProductCommand(
        ProductsUseCasesMother.createPayload(),
      );

      const result = await handler.execute(command);

      expect(useCase.execute).toHaveBeenCalledWith(command.payload);
      expect(result).toEqual(ProductsUseCasesMother.primitives());
    });
  });
});
