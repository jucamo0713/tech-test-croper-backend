import { ProductRepositoryGatewayToken } from '@products/domain/models/gateways';
import { ProductRepositoryAdapter } from '@products/infrastructure/driven-adapters';

export const GatewayProviders = [
  ProductRepositoryAdapter,
  {
    provide: ProductRepositoryGatewayToken,
    useExisting: ProductRepositoryAdapter,
  },
];
