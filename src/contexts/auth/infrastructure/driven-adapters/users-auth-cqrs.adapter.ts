import { Inject, Injectable } from '@nestjs/common';
import { CqrsCallerRepositoryToken } from '@shared/domain/models/gateways';
import type { CqrsCallerRepository } from '@shared/domain/models/gateways';
import { AuthUserOnlyResponse } from '@auth/domain/models/cqrs/commands';
import {
  toAuthUserResponse,
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
  }): Promise<AuthUserOnlyResponse> {
    const user = await this.cqrsCaller.dispatch(
      new CreateUserCommand(params.email, params.passwordHash),
      {
        showCommand: false,
        showResult: false,
      },
    );

    return {
      user: toAuthUserResponse(user),
    };
  }

  findUserByEmail(email: string): Promise<UserForAuthentication | null> {
    return this.cqrsCaller.query(new GetUserByEmailQuery(email), {
      showQuery: false,
      showResult: false,
    });
  }
}
