import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CqrsCallerRepositoryToken } from '@shared/domain/models/gateways';
import type { CqrsCallerRepository } from '@shared/domain/models/gateways';
import {
  LoginCommand,
  RegisterCommand,
} from '@auth/domain/models/cqrs/commands';
import {
  AuthResponseDto,
  LoginRequestDto,
  RegisterRequestDto,
} from '@auth/infrastructure/dtos';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(CqrsCallerRepositoryToken)
    private readonly cqrsCaller: CqrsCallerRepository,
  ) {}

  @Post('register')
  register(@Body() body: RegisterRequestDto): Promise<AuthResponseDto> {
    return this.cqrsCaller.dispatch(
      new RegisterCommand(body.email, body.password),
      {
        showCommand: false,
        showResult: false,
      },
    );
  }

  @Post('login')
  login(@Body() body: LoginRequestDto): Promise<AuthResponseDto> {
    return this.cqrsCaller.dispatch(
      new LoginCommand(body.email, body.password),
      {
        showCommand: false,
        showResult: false,
      },
    );
  }
}
