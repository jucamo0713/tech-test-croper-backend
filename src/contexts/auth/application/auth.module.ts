import { Module } from '@nestjs/common';
import { Controllers } from '@auth/infrastructure/ui/controllers';
import {
  CommandHandlers,
  EventHandlers,
  GatewayProviders,
  QueryHandlers,
  UseCaseProviders,
} from './providers';

@Module({
  controllers: [...Controllers],
  providers: [
    ...UseCaseProviders,
    ...GatewayProviders,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
  exports: [],
})
export class AuthModule {}
