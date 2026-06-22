import { Email } from '@shared/domain/models/value-objects/string';
import { UserAuthenticationPrimitives } from '@users/domain/models/cqrs/queries';
import { UserRepositoryGateway } from '@users/domain/models/gateways';

export class GetUserByEmailUseCase {
  constructor(private readonly userRepository: UserRepositoryGateway) {}

  async execute(email: string): Promise<UserAuthenticationPrimitives | null> {
    const user = await this.userRepository.findByEmail(
      new Email(email).toString(),
    );

    return user?.toPrimitives() ?? null;
  }
}
