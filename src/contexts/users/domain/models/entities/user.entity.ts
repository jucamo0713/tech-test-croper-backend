import type {
  Email,
  IdValueObject,
} from '@shared/domain/models/value-objects/string';

export interface UserProps {
  userId: IdValueObject;
  email: Email;
  password: string;
  status?: string;
}

export interface UserPrimitives {
  userId: string;
  email: string;
  password: string;
  status?: string;
}

export class User {
  constructor(private readonly props: UserProps) {}

  public get id(): IdValueObject {
    return this.props.userId;
  }

  public get email(): Email {
    return this.props.email;
  }

  public get password(): string {
    return this.props.password;
  }

  public get status(): string | undefined {
    return this.props.status;
  }

  public toPrimitives(): UserPrimitives {
    return {
      userId: this.props.userId.toString(),
      email: this.props.email.toString(),
      password: this.props.password,
      status: this.props.status,
    };
  }
}
