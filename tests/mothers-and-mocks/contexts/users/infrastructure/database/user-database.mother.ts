import { UserDto } from '@users/infrastructure/dtos';
import { UserSchemaType } from '@users/infrastructure/database';
import { Connection, Model } from 'mongoose';

type UserModelFactory = (
  name: string,
  schema: UserSchemaType,
) => Model<UserDto>;

export class UserDatabaseMother {
  static fieldOptions(): Record<string, Record<string, unknown>> {
    return {
      userId: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      passwordHash: {
        type: String,
        required: true,
        select: false,
      },
      status: {
        type: String,
        required: false,
        trim: true,
      },
    };
  }

  static indexes(): [Record<string, 1>, Record<string, unknown>][] {
    return [
      [{ userId: 1 }, { unique: true }],
      [{ email: 1 }, { unique: true }],
      [{ status: 1 }, {}],
    ];
  }

  static model(): Model<UserDto> {
    return {} as Model<UserDto>;
  }

  static connection(model: Model<UserDto> = UserDatabaseMother.model()): {
    connection: Connection;
    model: Model<UserDto>;
    modelFactory: jest.MockedFunction<UserModelFactory>;
  } {
    const modelFactory: jest.MockedFunction<UserModelFactory> = jest.fn(
      (): Model<UserDto> => model,
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
