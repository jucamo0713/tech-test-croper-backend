import { CqrsCallerRepository } from '@shared/domain/models/gateways';
import { AuthUseCasesMother } from '../../domain/use-cases/auth-use-cases.mother';

export class UsersAuthCqrsAdapterMother {
  static cqrsCaller(): jest.Mocked<CqrsCallerRepository> {
    return {
      dispatch: jest.fn(),
      emit: jest.fn(),
      query: jest.fn(),
    };
  }

  static createdUser() {
    return AuthUseCasesMother.authResponse().user;
  }

  static userForAuthentication() {
    return AuthUseCasesMother.userForAuthentication();
  }
}
