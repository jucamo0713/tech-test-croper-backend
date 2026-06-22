import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  GetUserByEmailQuery,
  UserAuthenticationPrimitives,
} from '@users/domain/models/cqrs/queries';
import { GetUserByEmailUseCase } from '@users/domain/use-cases';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailQueryHandler implements IQueryHandler<
  GetUserByEmailQuery,
  UserAuthenticationPrimitives | null
> {
  constructor(private readonly getUserByEmailUseCase: GetUserByEmailUseCase) {}

  execute(
    query: GetUserByEmailQuery,
  ): Promise<UserAuthenticationPrimitives | null> {
    return this.getUserByEmailUseCase.execute(query.email);
  }
}
