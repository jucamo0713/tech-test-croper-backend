import { LangIsoCodeConstants } from '@shared/domain/models/constants';
import {
  PriceFieldSchemaDefinition,
  TranslatableFieldSchemaDefinition,
} from '@shared/infrastructure/driven-adapters/database/mongoose';
import {
  HydratedDocument,
  Schema,
  SchemaDefinition,
  SchemaDefinitionProperty,
} from 'mongoose';
import { ProductDto } from '../dtos/product.dto';

export type ProductDocument = HydratedDocument<ProductDto>;

const translatableFieldSchemaDefinition =
  TranslatableFieldSchemaDefinition as SchemaDefinitionProperty<
    ProductDto['name']
  >;
const priceFieldSchemaDefinition =
  PriceFieldSchemaDefinition as SchemaDefinitionProperty<ProductDto['prices']>;

const definition: Required<SchemaDefinition<ProductDto>> = {
  productId: {
    type: String,
    required: true,
    trim: true,
  },
  name: translatableFieldSchemaDefinition,
  description: {
    ...TranslatableFieldSchemaDefinition,
    required: false,
  } as SchemaDefinitionProperty<ProductDto['description']>,
  prices: priceFieldSchemaDefinition,
  status: {
    type: String,
    required: false,
    trim: true,
  },
};

export type ProductSchemaType = Schema<ProductDto>;

export const ProductSchema: ProductSchemaType = new Schema(definition, {
  timestamps: true,
});

ProductSchema.index({ productId: 1 }, { unique: true });
Object.values(LangIsoCodeConstants).forEach((language) => {
  ProductSchema.index({ [`name.${language}`]: 1 });
});
ProductSchema.index({ status: 1 });
