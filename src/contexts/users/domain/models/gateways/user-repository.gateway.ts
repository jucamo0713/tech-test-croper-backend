import { User } from '@users/domain/models/entities';

export const UserRepositoryGatewayToken = Symbol('UserRepositoryGateway');

export interface UserRepositoryGateway {
  create(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
}
