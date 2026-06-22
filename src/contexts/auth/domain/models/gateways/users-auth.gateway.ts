import { AuthUser } from '@auth/domain/models/entities';

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
  }): Promise<AuthUser>;
  findUserByEmail(email: string): Promise<UserForAuthentication | null>;
}
