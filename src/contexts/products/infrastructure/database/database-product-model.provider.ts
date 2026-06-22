import { FactoryProvider } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { DatabaseConstants } from '@shared/infrastructure/driven-adapters/database';
import { ProductDto } from '../dtos/product.dto';
import { DatabaseProductConfigConstants } from '@products/infrastructure';
import { ProductSchema } from './product.model';

export const DatabaseProductModelProvider: FactoryProvider<Model<ProductDto>> =
  {
    inject: [getConnectionToken(DatabaseConstants.DATABASE_CONNECTION_NAME)],
    provide: DatabaseProductConfigConstants.PRODUCT_DOCUMENT,
    useFactory: (connection: Connection): Model<ProductDto> => {
      return connection.model<ProductDto>(
        DatabaseProductConfigConstants.PRODUCT_COLLECTION_NAME,
        ProductSchema,
      );
    },
  };
