import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { Controllers } from '@shared/infrastructure/ui/controllers';
import {
  CommandHandlers,
  EventHandlers,
  GatewayProviders,
  QueryHandlers,
  UseCaseProviders,
} from './providers';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CqrsModule,
  ],
  controllers: [...Controllers],
  providers: [
    ...UseCaseProviders,
    ...GatewayProviders,
    ...CommandHandlers,
    ...QueryHandlers,
    ...EventHandlers,
  ],
  exports: [ConfigModule, CqrsModule],
})
export class SharedModule {}
