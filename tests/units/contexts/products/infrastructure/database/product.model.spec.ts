import {
  PriceFieldSchemaDefinition,
  TranslatableFieldSchemaDefinition,
} from '@shared/infrastructure/driven-adapters/database/mongoose';
import { ProductSchema } from '@products/infrastructure/database';
import { ProductDatabaseMother } from '../../../../../mothers-and-mocks/contexts/products/infrastructure/database/product-database.mother';

const getPathOptions = (path: string): Record<string, unknown> => {
  const schemaType = ProductSchema.path(path);

  expect(schemaType).toBeDefined();

  return schemaType.options;
};

describe('ProductSchema', () => {
  describe('definition', () => {
    it('should enable timestamps', () => {
      expect(ProductSchema.get('timestamps')).toBe(true);
    });

    it('should define the expected fields', () => {
      const fieldOptions = ProductDatabaseMother.fieldOptions();
      const nameOptions = getPathOptions('name');
      const descriptionOptions = getPathOptions('description');
      const pricesOptions = getPathOptions('prices');

      expect(getPathOptions('productId')).toMatchObject(fieldOptions.productId);
      expect(nameOptions).toMatchObject(TranslatableFieldSchemaDefinition);
      expect(descriptionOptions).toMatchObject({
        ...TranslatableFieldSchemaDefinition,
        required: false,
      });
      expect(pricesOptions).toMatchObject(PriceFieldSchemaDefinition);
      expect(getPathOptions('status')).toMatchObject(fieldOptions.status);
    });

    it('should define the expected indexes', () => {
      expect(ProductSchema.indexes()).toEqual(
        expect.arrayContaining(ProductDatabaseMother.indexes()),
      );
    });

    it('should use shared translatable and price field structures', () => {
      expect(getPathOptions('name')).toMatchObject(
        TranslatableFieldSchemaDefinition,
      );
      expect(getPathOptions('prices')).toMatchObject(
        PriceFieldSchemaDefinition,
      );
    });
  });
});
