import { AuthUser, type AuthUserPrimitives } from '@auth/domain';

export interface AuthSessionProps {
  user: AuthUser;
  sessionToken: string;
  refreshToken: string;
}

export interface AuthSessionPrimitives {
  user: AuthUserPrimitives;
  sessionToken: string;
  refreshToken: string;
}

export class AuthSession {
  constructor(private readonly props: AuthSessionProps) {}

  public get user(): AuthUser {
    return this.props.user;
  }

  public get sessionToken(): string {
    return this.props.sessionToken;
  }

  public get refreshToken(): string {
    return this.props.refreshToken;
  }

  public toPrimitives(): AuthSessionPrimitives {
    return {
      user: this.props.user.toPrimitives(),
      sessionToken: this.props.sessionToken,
      refreshToken: this.props.refreshToken,
    };
  }
}
