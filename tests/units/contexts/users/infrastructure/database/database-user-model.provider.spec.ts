import { getConnectionToken } from '@nestjs/mongoose';
import {
  DatabaseUserConfigConstants,
  DatabaseUserModelProvider,
  UserSchema,
} from '@users/infrastructure/database';
import { UserDto } from '@users/infrastructure/dtos';
import { DatabaseConstants } from '@shared/infrastructure/driven-adapters/database';
import { Connection, Model } from 'mongoose';

describe('DatabaseUserModelProvider', () => {
  describe('configuration', () => {
    it('should use the shared mongoose connection token', () => {
      expect(DatabaseUserModelProvider.inject).toEqual([
        getConnectionToken(DatabaseConstants.DATABASE_CONNECTION_NAME),
      ]);
    });
  });

  describe('useFactory', () => {
    it('should register the user model using the provided connection', () => {
      const model = {} as Model<UserDto>;
      const modelFactory = jest.fn((): Model<UserDto> => model);
      const connection = {
        model: modelFactory,
      } as unknown as Connection;

      const result = DatabaseUserModelProvider.useFactory?.(connection);

      expect(modelFactory).toHaveBeenCalledWith(
        DatabaseUserConfigConstants.USER_COLLECTION_NAME,
        UserSchema,
      );
      expect(result).toBe(model);
    });
  });
});
