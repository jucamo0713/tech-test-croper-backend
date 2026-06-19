import { Module } from '@nestjs/common';
import { AuthModule } from '@auth';
import { ProductsModule } from '@products';
import { SharedModule } from '@shared';
import { UsersModule } from '@users';

@Module({
  imports: [SharedModule, UsersModule, AuthModule, ProductsModule],
})
export class AppModule {}
