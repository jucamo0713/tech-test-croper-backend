import { LangIsoCodeConstants } from '@shared/domain/models/constants';
import {
  PriceFieldSchemaDefinition,
  TranslatableFieldSchemaDefinition,
} from '@shared/infrastructure/driven-adapters/database/mongoose';
import { ProductSchema } from '@products/infrastructure/database';

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
      const productIdOptions = getPathOptions('productId');
      const nameOptions = getPathOptions('name');
      const descriptionOptions = getPathOptions('description');
      const pricesOptions = getPathOptions('prices');
      const statusOptions = getPathOptions('status');

      expect(productIdOptions).toMatchObject({
        type: String,
        required: true,
        trim: true,
      });
      expect(nameOptions).toMatchObject(TranslatableFieldSchemaDefinition);
      expect(descriptionOptions).toMatchObject({
        ...TranslatableFieldSchemaDefinition,
        required: false,
      });
      expect(pricesOptions).toMatchObject(PriceFieldSchemaDefinition);
      expect(statusOptions).toMatchObject({
        type: String,
        required: false,
        trim: true,
      });
    });

    it('should define the expected indexes', () => {
      const nameIndexes = Object.values(LangIsoCodeConstants).map(
        (language) => [{ [`name.${language}`]: 1 }, {}],
      );

      expect(ProductSchema.indexes()).toEqual(
        expect.arrayContaining([
          [{ productId: 1 }, { unique: true }],
          ...nameIndexes,
          [{ status: 1 }, {}],
        ]),
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
