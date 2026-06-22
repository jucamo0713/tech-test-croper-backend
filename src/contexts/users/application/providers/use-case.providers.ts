import {
  UserRepositoryGateway,
  UserRepositoryGatewayToken,
} from '@users/domain/models/gateways';
import {
  CreateUserUseCase,
  GetUserByEmailUseCase,
} from '@users/domain/use-cases';

export const UseCaseProviders = [
  {
    provide: CreateUserUseCase,
    inject: [UserRepositoryGatewayToken],
    useFactory: (userRepository: UserRepositoryGateway): CreateUserUseCase =>
      new CreateUserUseCase(userRepository),
  },
  {
    provide: GetUserByEmailUseCase,
    inject: [UserRepositoryGatewayToken],
    useFactory: (
      userRepository: UserRepositoryGateway,
    ): GetUserByEmailUseCase => new GetUserByEmailUseCase(userRepository),
  },
];
