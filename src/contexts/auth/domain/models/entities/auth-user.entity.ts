export interface AuthUserProps {
  userId: string;
  email: string;
  status?: string;
}

export interface AuthUserPrimitives {
  userId: string;
  email: string;
  status?: string;
}

export class AuthUser {
  constructor(private readonly props: AuthUserProps) {}

  public get userId(): string {
    return this.props.userId;
  }

  public get email(): string {
    return this.props.email;
  }

  public get status(): string | undefined {
    return this.props.status;
  }

  public toPrimitives(): AuthUserPrimitives {
    return {
      userId: this.props.userId,
      email: this.props.email,
      status: this.props.status,
    };
  }
}
