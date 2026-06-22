import { Inject, Injectable } from '@nestjs/common';
import { CqrsCallerRepositoryToken } from '@shared/domain/models/gateways';
import type { CqrsCallerRepository } from '@shared/domain/models/gateways';
import { AuthUser } from '@auth/domain/models/entities';
import {
  UserForAuthentication,
  UsersAuthGateway,
} from '@auth/domain/models/gateways';
import { CreateUserCommand } from '@users/domain/models/cqrs/commands';
import { GetUserByEmailQuery } from '@users/domain/models/cqrs/queries';

@Injectable()
export class UsersAuthCqrsAdapter implements UsersAuthGateway {
  constructor(
    @Inject(CqrsCallerRepositoryToken)
    private readonly cqrsCaller: CqrsCallerRepository,
  ) {}

  async createUser(params: {
    email: string;
    passwordHash: string;
  }): Promise<AuthUser> {
    const user = await this.cqrsCaller.dispatch(
      new CreateUserCommand(params.email, params.passwordHash),
      {
        showCommand: false,
        showResult: false,
      },
    );

    return new AuthUser({
      userId: user.userId,
      email: user.email,
      status: user.status,
    });
  }

  findUserByEmail(email: string): Promise<UserForAuthentication | null> {
    return this.cqrsCaller.query(new GetUserByEmailQuery(email), {
      showQuery: false,
      showResult: false,
    });
  }
}
