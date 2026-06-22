import { UserSchema } from '@users/infrastructure/database';
import { UserDatabaseMother } from '../../../../../mothers-and-mocks/contexts/users/infrastructure/database/user-database.mother';

const getPathOptions = (path: string): Record<string, unknown> => {
  const schemaType = UserSchema.path(path);

  expect(schemaType).toBeDefined();

  return schemaType.options;
};

describe('UserSchema', () => {
  describe('definition', () => {
    it('should enable timestamps', () => {
      expect(UserSchema.get('timestamps')).toBe(true);
    });

    it('should define the expected fields', () => {
      const fieldOptions = UserDatabaseMother.fieldOptions();

      expect(getPathOptions('userId')).toMatchObject(fieldOptions.userId);
      expect(getPathOptions('email')).toMatchObject(fieldOptions.email);
      expect(getPathOptions('password')).toMatchObject(fieldOptions.password);
      expect(getPathOptions('status')).toMatchObject(fieldOptions.status);
    });

    it('should define the expected indexes', () => {
      expect(UserSchema.indexes()).toEqual(
        expect.arrayContaining(UserDatabaseMother.indexes()),
      );
    });
  });
});
