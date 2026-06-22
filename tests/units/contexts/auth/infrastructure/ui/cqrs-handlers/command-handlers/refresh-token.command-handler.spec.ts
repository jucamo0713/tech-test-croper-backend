/* eslint-disable @typescript-eslint/unbound-method */
import { RefreshTokenUseCase } from '@auth/domain/use-cases';
import { RefreshTokenCommandHandler } from '@auth/infrastructure/ui/cqrs-handlers/command-handlers';
import { AuthUseCasesMother } from '../../../../../../../mothers-and-mocks/contexts/auth/domain/use-cases/auth-use-cases.mother';

describe('RefreshTokenCommandHandler', () => {
  describe('execute', () => {
    it('should call refresh token use case', async () => {
      const refreshTokenUseCase = {
        execute: jest.fn().mockReturnValue(AuthUseCasesMother.authResponse()),
      } as unknown as jest.Mocked<RefreshTokenUseCase>;
      const handler = new RefreshTokenCommandHandler(refreshTokenUseCase);
      const command = AuthUseCasesMother.refreshTokenCommand();

      const result = await handler.execute(command);

      expect(refreshTokenUseCase.execute).toHaveBeenCalledWith({
        refreshToken: command.refreshToken,
      });
      expect(result).toEqual(AuthUseCasesMother.authResponse());
    });
  });
});
