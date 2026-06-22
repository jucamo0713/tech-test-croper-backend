import { UserSchema } from '@users/infrastructure/database';

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
      const userIdOptions = getPathOptions('userId');
      const emailOptions = getPathOptions('email');
      const passwordOptions = getPathOptions('password');
      const statusOptions = getPathOptions('status');

      expect(userIdOptions).toMatchObject({
        type: String,
        required: true,
        trim: true,
      });
      expect(emailOptions).toMatchObject({
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      });
      expect(passwordOptions).toMatchObject({
        type: String,
        required: true,
        select: false,
      });
      expect(statusOptions).toMatchObject({
        type: String,
        required: false,
        trim: true,
      });
    });

    it('should define the expected indexes', () => {
      expect(UserSchema.indexes()).toEqual(
        expect.arrayContaining([
          [{ userId: 1 }, { unique: true }],
          [{ email: 1 }, { unique: true }],
          [{ status: 1 }, {}],
        ]),
      );
    });
  });
});
