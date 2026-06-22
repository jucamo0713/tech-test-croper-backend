import { getConnectionToken } from '@nestjs/mongoose';
import {
  DatabaseProductConfigConstants,
  DatabaseProductModelProvider,
  ProductSchema,
} from '@products/infrastructure/database';
import { DatabaseConstants } from '@shared/infrastructure/driven-adapters/database';
import { ProductDatabaseMother } from '../../../../../mothers-and-mocks/contexts/products/infrastructure/database/product-database.mother';

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
      const { connection, model, modelFactory } =
        ProductDatabaseMother.connection();

      const result = DatabaseProductModelProvider.useFactory?.(connection);

      expect(modelFactory).toHaveBeenCalledWith(
        DatabaseProductConfigConstants.PRODUCT_COLLECTION_NAME,
        ProductSchema,
      );
      expect(result).toBe(model);
    });
  });
});
