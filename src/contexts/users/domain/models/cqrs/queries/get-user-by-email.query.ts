import { Query } from '@nestjs/cqrs';

export interface UserAuthenticationPrimitives {
  userId: string;
  email: string;
  passwordHash: string;
  status?: string;
}

export class GetUserByEmailQuery extends Query<UserAuthenticationPrimitives | null> {
  constructor(public readonly email: string) {
    super();
  }
}
