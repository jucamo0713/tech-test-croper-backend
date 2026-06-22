import { HydratedDocument, Schema, SchemaDefinition } from 'mongoose';
import { UserDto } from '../dtos/user.dto';

export type UserDocument = HydratedDocument<UserDto>;

const definition: Required<SchemaDefinition<UserDto>> = {
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

export type UserSchemaType = Schema<UserDto>;

export const UserSchema: UserSchemaType = new Schema(definition, {
  timestamps: true,
});

UserSchema.index({ userId: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ status: 1 });
