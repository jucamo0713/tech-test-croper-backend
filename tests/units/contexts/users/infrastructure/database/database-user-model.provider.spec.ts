import { getConnectionToken } from '@nestjs/mongoose';
import {
  DatabaseUserConfigConstants,
  DatabaseUserModelProvider,
  UserSchema,
} from '@users/infrastructure/database';
import { DatabaseConstants } from '@shared/infrastructure/driven-adapters/database';
import { UserDatabaseMother } from '../../../../../mothers-and-mocks/contexts/users/infrastructure/database/user-database.mother';

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
      const { connection, model, modelFactory } =
        UserDatabaseMother.connection();

      const result = DatabaseUserModelProvider.useFactory?.(connection);

      expect(modelFactory).toHaveBeenCalledWith(
        DatabaseUserConfigConstants.USER_COLLECTION_NAME,
        UserSchema,
      );
      expect(result).toBe(model);
    });
  });
});
