import { ProductDto } from '@products/infrastructure/dtos';
import { Model } from 'mongoose';
import { ProductsUseCasesMother } from '../../domain/use-cases/products-use-cases.mother';

type ProductModelMock = jest.Mocked<
  Pick<
    Model<ProductDto>,
    'create' | 'findOne' | 'aggregate' | 'findOneAndUpdate' | 'deleteOne'
  >
>;

export class ProductRepositoryAdapterMother {
  static productDto(): ProductDto {
    return ProductsUseCasesMother.primitives();
  }

  static productModel(): ProductModelMock {
    return {
      create: jest.fn(),
      findOne: jest.fn(),
      aggregate: jest.fn(),
      findOneAndUpdate: jest.fn(),
      deleteOne: jest.fn(),
    };
  }

  static createdDocument(
    product: ProductDto = ProductRepositoryAdapterMother.productDto(),
  ) {
    return {
      toObject: jest.fn(() => product),
    };
  }

  static findOneQuery(
    product: ProductDto | null = ProductRepositoryAdapterMother.productDto(),
  ) {
    return {
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(product),
    };
  }

  static aggregateQuery(
    products: ProductDto[] = [ProductRepositoryAdapterMother.productDto()],
    total = 1,
  ) {
    return {
      exec: jest.fn().mockResolvedValue([
        {
          total: {
            total,
          },
          data: products,
        },
      ]),
    };
  }

  static deleteQuery(deletedCount = 1) {
    return {
      exec: jest.fn().mockResolvedValue({ deletedCount }),
    };
  }
}
