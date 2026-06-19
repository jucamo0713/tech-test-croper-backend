import { Module } from '@nestjs/common';
import { Controllers } from '@products/infrastructure/ui/controllers';
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
export class ProductsModule {}
