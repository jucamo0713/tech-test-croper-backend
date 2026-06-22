import { Module } from '@nestjs/common';
import { Controllers } from '@users/infrastructure/ui/controllers';
import {
  CommandHandlers,
  DatabaseProviders,
  EventHandlers,
  GatewayProviders,
  QueryHandlers,
  UseCaseProviders,
} from './providers';

@Module({
  controllers: [...Controllers],
  providers: [
    ...DatabaseProviders,
    ...UseCaseProviders,
    ...GatewayProviders,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
  exports: [],
})
export class UsersModule {}
