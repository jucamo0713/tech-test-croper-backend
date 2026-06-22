import { UserRepositoryGatewayToken } from '@users/domain/models/gateways';
import { UserRepositoryAdapter } from '@users/infrastructure/driven-adapters';

export const GatewayProviders = [
  UserRepositoryAdapter,
  {
    provide: UserRepositoryGatewayToken,
    useExisting: UserRepositoryAdapter,
  },
];
