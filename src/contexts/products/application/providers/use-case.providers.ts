import {
  ProductRepositoryGateway,
  ProductRepositoryGatewayToken,
} from '@products/domain/models/gateways';
import {
  CreateProductUseCase,
  DeleteProductUseCase,
  GetPaginatedProductsUseCase,
  GetProductByIdUseCase,
  UpdateProductUseCase,
} from '@products/domain/use-cases';

export const UseCaseProviders = [
  {
    provide: CreateProductUseCase,
    inject: [ProductRepositoryGatewayToken],
    useFactory: (
      productRepository: ProductRepositoryGateway,
    ): CreateProductUseCase => new CreateProductUseCase(productRepository),
  },
  {
    provide: GetProductByIdUseCase,
    inject: [ProductRepositoryGatewayToken],
    useFactory: (
      productRepository: ProductRepositoryGateway,
    ): GetProductByIdUseCase => new GetProductByIdUseCase(productRepository),
  },
  {
    provide: GetPaginatedProductsUseCase,
    inject: [ProductRepositoryGatewayToken],
    useFactory: (
      productRepository: ProductRepositoryGateway,
    ): GetPaginatedProductsUseCase =>
      new GetPaginatedProductsUseCase(productRepository),
  },
  {
    provide: UpdateProductUseCase,
    inject: [ProductRepositoryGatewayToken],
    useFactory: (
      productRepository: ProductRepositoryGateway,
    ): UpdateProductUseCase => new UpdateProductUseCase(productRepository),
  },
  {
    provide: DeleteProductUseCase,
    inject: [ProductRepositoryGatewayToken],
    useFactory: (
      productRepository: ProductRepositoryGateway,
    ): DeleteProductUseCase => new DeleteProductUseCase(productRepository),
  },
];
