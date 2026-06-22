/* eslint-disable @typescript-eslint/unbound-method */
import { CurrencyConstants } from '@shared/domain/models/constants';
import {
  CreateProductCommand,
  DeleteProductCommand,
  UpdateProductCommand,
} from '@products/domain/models/cqrs/commands';
import {
  GetPaginatedProductsQuery,
  GetProductByIdQuery,
} from '@products/domain/models/cqrs/queries';
import { ProductsController } from '@products/infrastructure/ui/controllers';
import { GetPaginatedProductsQueryDto } from '@products/infrastructure/dtos';
import { UsersAuthCqrsAdapterMother } from '../../../../../../mothers-and-mocks/contexts/auth/infrastructure/driven-adapters/users-auth-cqrs-adapter.mother';
import { ProductsUseCasesMother } from '../../../../../../mothers-and-mocks/contexts/products/domain/use-cases/products-use-cases.mother';

describe('ProductsController', () => {
  describe('create', () => {
    it('should execute CreateProductCommand using CqrsCaller', async () => {
      const cqrsCaller = UsersAuthCqrsAdapterMother.cqrsCaller();
      cqrsCaller.dispatch.mockResolvedValue(
        ProductsUseCasesMother.primitives(),
      );
      const controller = new ProductsController(cqrsCaller);

      const result = await controller.create(
        ProductsUseCasesMother.createPayload(),
      );

      expect(cqrsCaller.dispatch).toHaveBeenCalledWith(
        expect.any(CreateProductCommand),
      );
      expect(cqrsCaller.query).not.toHaveBeenCalled();
      expect(cqrsCaller.emit).not.toHaveBeenCalled();
      expect(result).toEqual(ProductsUseCasesMother.primitives());
    });
  });

  describe('findPaginated', () => {
    it('should execute GetPaginatedProductsQuery and pass filters using CqrsCaller', async () => {
      const cqrsCaller = UsersAuthCqrsAdapterMother.cqrsCaller();
      cqrsCaller.query.mockResolvedValue(
        ProductsUseCasesMother.paginatedResult(),
      );
      const controller = new ProductsController(cqrsCaller);
      const query = Object.assign(new GetPaginatedProductsQueryDto(), {
        page: 1,
        limit: 10,
        search: 'coffee',
        currency: CurrencyConstants.USD,
      });

      const result = await controller.findPaginated(query);

      expect(cqrsCaller.query).toHaveBeenCalledWith(
        expect.any(GetPaginatedProductsQuery),
      );
      const dispatchedQuery = cqrsCaller.query.mock
        .calls[0][0] as GetPaginatedProductsQuery;
      expect(dispatchedQuery.criteria.filters).toMatchObject({
        search: 'coffee',
        currency: CurrencyConstants.USD,
      });
      expect(cqrsCaller.dispatch).not.toHaveBeenCalled();
      expect(result).toEqual(ProductsUseCasesMother.paginatedResult());
    });
  });

  describe('findById', () => {
    it('should execute GetProductByIdQuery using CqrsCaller', async () => {
      const cqrsCaller = UsersAuthCqrsAdapterMother.cqrsCaller();
      cqrsCaller.query.mockResolvedValue(ProductsUseCasesMother.primitives());
      const controller = new ProductsController(cqrsCaller);

      const result = await controller.findById(
        ProductsUseCasesMother.productId(),
      );

      expect(cqrsCaller.query).toHaveBeenCalledWith(
        expect.any(GetProductByIdQuery),
      );
      expect(result).toEqual(ProductsUseCasesMother.primitives());
    });
  });

  describe('update', () => {
    it('should execute UpdateProductCommand using CqrsCaller', async () => {
      const cqrsCaller = UsersAuthCqrsAdapterMother.cqrsCaller();
      cqrsCaller.dispatch.mockResolvedValue(
        ProductsUseCasesMother.primitives(),
      );
      const controller = new ProductsController(cqrsCaller);

      const result = await controller.update(
        ProductsUseCasesMother.productId(),
        ProductsUseCasesMother.updatePayload(),
      );

      expect(cqrsCaller.dispatch).toHaveBeenCalledWith(
        expect.any(UpdateProductCommand),
      );
      expect(result).toEqual(ProductsUseCasesMother.primitives());
    });
  });

  describe('delete', () => {
    it('should execute DeleteProductCommand using CqrsCaller', async () => {
      const cqrsCaller = UsersAuthCqrsAdapterMother.cqrsCaller();
      cqrsCaller.dispatch.mockResolvedValue(undefined);
      const controller = new ProductsController(cqrsCaller);

      await controller.delete(ProductsUseCasesMother.productId());

      expect(cqrsCaller.dispatch).toHaveBeenCalledWith(
        expect.any(DeleteProductCommand),
      );
    });
  });
});
