import { Pagination } from '@shared/domain/models/entities';
import { Product } from '@products/domain/models/entities';
import { ProductRepositoryGateway } from '@products/domain/models/gateways';
import { ProductMother } from '../models/entities/product.entity.mother';

export class ProductsUseCasesMother {
  static productId(): string {
    return ProductMother.props().productId.toString();
  }

  static product(): Product {
    return new Product(ProductMother.props());
  }

  static primitives() {
    return ProductsUseCasesMother.product().toPrimitives();
  }

  static createPayload() {
    const primitives = ProductsUseCasesMother.primitives();

    return {
      name: primitives.name,
      description: primitives.description,
      prices: primitives.prices,
      status: primitives.status,
    };
  }

  static updatePayload() {
    return {
      status: 'inactive',
    };
  }

  static paginatedResult() {
    return new Pagination([ProductsUseCasesMother.product()], 1, 10, 1);
  }

  static repository(): jest.Mocked<ProductRepositoryGateway> {
    return {
      create: jest.fn(),
      findById: jest.fn(),
      findPaginated: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  }
}
