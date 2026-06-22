import { Email } from '@shared/domain/models/value-objects/string';
import { User } from '@users/domain/models/entities';
import { CreateUserCommandResult } from '@users/domain/models/cqrs/commands';
import { UserRepositoryGateway } from '@users/domain/models/gateways';
import { UserId } from '@users/domain/models/value-objects';

export interface CreateUserUseCaseParams {
  email: string;
  passwordHash: string;
  status?: string;
}

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepositoryGateway) {}

  async execute(
    params: CreateUserUseCaseParams,
  ): Promise<CreateUserCommandResult> {
    const user = new User({
      userId: UserId.generateInstance(),
      email: new Email(params.email),
      passwordHash: params.passwordHash,
      status: params.status,
    });

    const createdUser = await this.userRepository.create(user);
    const primitives = createdUser.toPrimitives();

    return {
      userId: primitives.userId,
      email: primitives.email,
      status: primitives.status,
    };
  }
}
