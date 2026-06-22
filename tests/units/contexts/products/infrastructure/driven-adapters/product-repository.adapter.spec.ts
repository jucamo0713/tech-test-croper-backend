/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CurrencyConstants } from '@shared/domain/models/constants';
import { Product } from '@products/domain/models/entities';
import { ProductRepositoryAdapter } from '@products/infrastructure/driven-adapters';
import { ProductRepositoryAdapterMother } from '../../../../../mothers-and-mocks/contexts/products/infrastructure/driven-adapters/product-repository-adapter.mother';
import { ProductsUseCasesMother } from '../../../../../mothers-and-mocks/contexts/products/domain/use-cases/products-use-cases.mother';

describe('ProductRepositoryAdapter', () => {
  describe('create', () => {
    it('should persist and return a domain product', async () => {
      const productModel = ProductRepositoryAdapterMother.productModel();
      productModel.create.mockResolvedValue(
        ProductRepositoryAdapterMother.createdDocument(),
      );
      const adapter = new ProductRepositoryAdapter(productModel);

      const result = await adapter.create(ProductsUseCasesMother.product());

      expect(productModel.create).toHaveBeenCalledWith(
        ProductsUseCasesMother.primitives(),
      );
      expect(result).toBeInstanceOf(Product);
      expect(result.toPrimitives()).toEqual(
        ProductsUseCasesMother.primitives(),
      );
    });
  });

  describe('findById', () => {
    it('should find by productId and return a domain product', async () => {
      const productModel = ProductRepositoryAdapterMother.productModel();
      productModel.findOne.mockReturnValue(
        ProductRepositoryAdapterMother.findOneQuery(),
      );
      const adapter = new ProductRepositoryAdapter(productModel);

      const result = await adapter.findById(ProductsUseCasesMother.productId());

      expect(productModel.findOne).toHaveBeenCalledWith({
        productId: ProductsUseCasesMother.productId(),
      });
      expect(result).toBeInstanceOf(Product);
    });
  });

  describe('findPaginated', () => {
    it('should build filters, apply pagination, apply sort and return metadata', async () => {
      const productModel = ProductRepositoryAdapterMother.productModel();
      productModel.aggregate.mockReturnValue(
        ProductRepositoryAdapterMother.aggregateQuery(
          [ProductRepositoryAdapterMother.productDto()],
          11,
        ),
      );
      const adapter = new ProductRepositoryAdapter(productModel);

      const result = await adapter.findPaginated({
        page: 2,
        limit: 10,
        sortBy: 'status',
        sortOrder: 'asc',
        filters: {
          search: 'coffee',
          status: 'active',
          minPrice: 10,
          maxPrice: 20,
          currency: CurrencyConstants.USD,
        },
      });

      expect(productModel.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([
          {
            $match: expect.objectContaining({
              status: 'active',
              $and: expect.any(Array),
            }),
          },
          {
            $facet: expect.objectContaining({
              data: expect.arrayContaining([
                { $sort: { status: 1 } },
                { $skip: 10 },
                { $limit: 10 },
              ]),
              total: [{ $count: 'total' }],
            }),
          },
        ]),
      );
      expect(result.data).toEqual([expect.any(Product)]);
      expect(result.metadata).toEqual(
        expect.objectContaining({
          page: 2,
          limit: 10,
          totalItems: 11,
          totalPages: 2,
        }),
      );
    });

    it('should ignore undefined filters', async () => {
      const productModel = ProductRepositoryAdapterMother.productModel();
      productModel.aggregate.mockReturnValue(
        ProductRepositoryAdapterMother.aggregateQuery(),
      );
      const adapter = new ProductRepositoryAdapter(productModel);

      await adapter.findPaginated({
        page: 1,
        limit: 10,
        filters: {
          search: undefined,
          status: undefined,
          minPrice: undefined,
        },
      });

      expect(productModel.aggregate).toHaveBeenCalledWith(
        expect.arrayContaining([{ $match: {} }]),
      );
    });

    it('should not return mongoose documents directly', async () => {
      const productModel = ProductRepositoryAdapterMother.productModel();
      productModel.aggregate.mockReturnValue(
        ProductRepositoryAdapterMother.aggregateQuery(),
      );
      const adapter = new ProductRepositoryAdapter(productModel);

      const result = await adapter.findPaginated({ page: 1, limit: 10 });

      expect(result.data[0]).toBeInstanceOf(Product);
      expect(result.data[0]).not.toHaveProperty('toObject');
    });
  });

  describe('update', () => {
    it('should update mutable fields and return a domain product', async () => {
      const productModel = ProductRepositoryAdapterMother.productModel();
      productModel.findOneAndUpdate.mockReturnValue(
        ProductRepositoryAdapterMother.findOneQuery(),
      );
      const adapter = new ProductRepositoryAdapter(productModel);

      const result = await adapter.update(
        ProductsUseCasesMother.productId(),
        ProductsUseCasesMother.product(),
      );

      expect(productModel.findOneAndUpdate).toHaveBeenCalledWith(
        { productId: ProductsUseCasesMother.productId() },
        {
          $set: expect.not.objectContaining({
            productId: ProductsUseCasesMother.productId(),
          }),
        },
        { new: true },
      );
      expect(result).toBeInstanceOf(Product);
    });
  });

  describe('delete', () => {
    it('should delete by productId', async () => {
      const productModel = ProductRepositoryAdapterMother.productModel();
      productModel.deleteOne.mockReturnValue(
        ProductRepositoryAdapterMother.deleteQuery(),
      );
      const adapter = new ProductRepositoryAdapter(productModel);

      const result = await adapter.delete(ProductsUseCasesMother.productId());

      expect(productModel.deleteOne).toHaveBeenCalledWith({
        productId: ProductsUseCasesMother.productId(),
      });
      expect(result).toBe(true);
    });
  });
});
