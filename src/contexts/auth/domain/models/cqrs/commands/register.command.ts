import { Command } from '@nestjs/cqrs';

export interface AuthUserResponse {
  userId: string;
  email: string;
  status?: string;
}

export interface AuthUserOnlyResponse {
  user: AuthUserResponse;
}

export interface AuthResponse extends AuthUserOnlyResponse {
  sessionToken: string;
  refreshToken: string;
}

export class RegisterCommand extends Command<AuthResponse> {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {
    super();
  }
}
