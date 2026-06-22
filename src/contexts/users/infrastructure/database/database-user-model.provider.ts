import { FactoryProvider } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { DatabaseConstants } from '@shared/infrastructure/driven-adapters/database';
import { UserDto } from '../dtos/user.dto';
import { DatabaseUserConfigConstants } from '@users/infrastructure';
import { UserSchema } from './user.model';

export const DatabaseUserModelProvider: FactoryProvider<Model<UserDto>> = {
  inject: [getConnectionToken(DatabaseConstants.DATABASE_CONNECTION_NAME)],
  provide: DatabaseUserConfigConstants.USER_DOCUMENT,
  useFactory: (connection: Connection): Model<UserDto> => {
    return connection.model<UserDto>(
      DatabaseUserConfigConstants.USER_COLLECTION_NAME,
      UserSchema,
    );
  },
};
