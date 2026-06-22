import { LangIsoCodeConstants } from '@shared/domain/models/constants';
import { ProductSchemaType } from '@products/infrastructure/database';
import { ProductDto } from '@products/infrastructure/dtos';
import { Connection, Model } from 'mongoose';

type ProductModelFactory = (
  name: string,
  schema: ProductSchemaType,
) => Model<ProductDto>;

export class ProductDatabaseMother {
  static fieldOptions(): Record<string, Record<string, unknown>> {
    return {
      productId: {
        type: String,
        required: true,
        trim: true,
      },
      status: {
        type: String,
        required: false,
        trim: true,
      },
    };
  }

  static indexes(): [Record<string, 1>, Record<string, unknown>][] {
    const nameIndexes: [Record<string, 1>, Record<string, unknown>][] =
      Object.values(LangIsoCodeConstants).map((language) => [
        { [`name.${language}`]: 1 },
        {},
      ]);

    return [
      [{ productId: 1 }, { unique: true }],
      ...nameIndexes,
      [{ status: 1 }, {}],
    ];
  }

  static model(): Model<ProductDto> {
    return {} as Model<ProductDto>;
  }

  static connection(model: Model<ProductDto> = ProductDatabaseMother.model()): {
    connection: Connection;
    model: Model<ProductDto>;
    modelFactory: jest.MockedFunction<ProductModelFactory>;
  } {
    const modelFactory: jest.MockedFunction<ProductModelFactory> = jest.fn(
      (): Model<ProductDto> => model,
    );

    return {
      connection: {
        model: modelFactory,
      } as unknown as Connection,
      model,
      modelFactory,
    };
  }
}
