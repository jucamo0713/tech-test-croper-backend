import { Pagination } from '@shared/domain/models/entities';
import { Product } from '@products/domain/models/entities';
import { type ProductPaginationCriteria } from '@products/domain/models/gateways';

export const ProductRepositoryGatewayToken = Symbol('ProductRepositoryGateway');

export interface ProductRepositoryGateway {
  create(product: Product): Promise<Product>;
  findById(productId: string): Promise<Product | null>;
  findPaginated(
    criteria: ProductPaginationCriteria,
  ): Promise<Pagination<Product>>;
  update(productId: string, product: Product): Promise<Product | null>;
  delete(productId: string): Promise<boolean>;
}
