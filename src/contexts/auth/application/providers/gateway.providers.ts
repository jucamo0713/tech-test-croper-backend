import { UsersAuthGatewayToken } from '@auth/domain/models/gateways';
import { UsersAuthCqrsAdapter } from '@auth/infrastructure/driven-adapters';

export const GatewayProviders = [
  UsersAuthCqrsAdapter,
  {
    provide: UsersAuthGatewayToken,
    useExisting: UsersAuthCqrsAdapter,
  },
];
