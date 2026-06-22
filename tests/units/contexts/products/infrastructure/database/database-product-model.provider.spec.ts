import { getConnectionToken } from '@nestjs/mongoose';
import {
  DatabaseProductConfigConstants,
  DatabaseProductModelProvider,
  ProductSchema,
} from '@products/infrastructure/database';
import { ProductDto } from '@products/infrastructure/dtos';
import { DatabaseConstants } from '@shared/infrastructure/driven-adapters/database';
import { Connection, Model } from 'mongoose';

describe('DatabaseProductModelProvider', () => {
  describe('configuration', () => {
    it('should use the shared mongoose connection token', () => {
      expect(DatabaseProductModelProvider.inject).toEqual([
        getConnectionToken(DatabaseConstants.DATABASE_CONNECTION_NAME),
      ]);
    });
  });

  describe('useFactory', () => {
    it('should register the product model using the provided connection', () => {
      const model = {} as Model<ProductDto>;
      const modelFactory = jest.fn((): Model<ProductDto> => model);
      const connection = {
        model: modelFactory,
      } as unknown as Connection;

      const result = DatabaseProductModelProvider.useFactory?.(connection);

      expect(modelFactory).toHaveBeenCalledWith(
        DatabaseProductConfigConstants.PRODUCT_COLLECTION_NAME,
        ProductSchema,
      );
      expect(result).toBe(model);
    });
  });
});
