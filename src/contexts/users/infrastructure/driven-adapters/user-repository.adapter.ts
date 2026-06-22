import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Email } from '@shared/domain/models/value-objects/string';
import { User } from '@users/domain/models/entities';
import { UserRepositoryGateway } from '@users/domain/models/gateways';
import { UserId } from '@users/domain/models/value-objects';
import { DatabaseUserConfigConstants } from '@users/infrastructure/database';
import { UserDto } from '@users/infrastructure/dtos';

@Injectable()
export class UserRepositoryAdapter implements UserRepositoryGateway {
  constructor(
    @Inject(DatabaseUserConfigConstants.USER_DOCUMENT)
    private readonly userModel: Model<UserDto>,
  ) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.userModel.create(user.toPrimitives());

    return this.toDomain(createdUser.toObject<UserDto>());
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel
      .findOne({ email })
      .select('+passwordHash')
      .lean<UserDto>()
      .exec();

    return user ? this.toDomain(user) : null;
  }

  private toDomain(user: UserDto): User {
    return new User({
      userId: new UserId(user.userId),
      email: new Email(user.email),
      passwordHash: user.passwordHash,
      status: user.status,
    });
  }
}
