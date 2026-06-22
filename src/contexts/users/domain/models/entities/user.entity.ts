import type { Email } from '@shared/domain/models/value-objects/string';
import type { UserId } from '@users/domain/models/value-objects';

export interface UserProps {
  userId: UserId;
  email: Email;
  passwordHash: string;
  status?: string;
}

export interface UserPrimitives {
  userId: string;
  email: string;
  passwordHash: string;
  status?: string;
}

export class User {
  constructor(private readonly props: UserProps) {}

  public get id(): UserId {
    return this.props.userId;
  }

  public get email(): Email {
    return this.props.email;
  }

  public get passwordHash(): string {
    return this.props.passwordHash;
  }

  public get status(): string | undefined {
    return this.props.status;
  }

  public toPrimitives(): UserPrimitives {
    return {
      userId: this.props.userId.toString(),
      email: this.props.email.toString(),
      passwordHash: this.props.passwordHash,
      status: this.props.status,
    };
  }
}
