import {
  AuthUserOnlyResponse,
  AuthUserResponse,
} from '@auth/domain/models/cqrs/commands';

export const UsersAuthGatewayToken = Symbol('UsersAuthGateway');

export interface UserForAuthentication {
  userId: string;
  email: string;
  passwordHash: string;
  status?: string;
}

export interface UsersAuthGateway {
  createUser(params: {
    email: string;
    passwordHash: string;
  }): Promise<AuthUserOnlyResponse>;
  findUserByEmail(email: string): Promise<UserForAuthentication | null>;
}

export const toAuthUserResponse = (
  user: UserForAuthentication | AuthUserResponse,
): AuthUserResponse => ({
  userId: user.userId,
  email: user.email,
  status: user.status,
});
