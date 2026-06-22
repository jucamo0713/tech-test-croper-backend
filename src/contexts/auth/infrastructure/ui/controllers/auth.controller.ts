import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerEndpointDecorator } from '@shared/infrastructure/ui/controllers/swagger-endpoint.decorator';
import { CqrsCallerRepositoryToken } from '@shared/domain/models/gateways';
import type { CqrsCallerRepository } from '@shared/domain/models/gateways';
import {
  LoginCommand,
  RefreshTokenCommand,
  RegisterCommand,
} from '@auth/domain/models/cqrs/commands';
import {
  AuthResponseDto,
  LoginRequestDto,
  RefreshTokenRequestDto,
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
  @SwaggerEndpointDecorator({
    summary: 'Register a new user',
    description: 'Register a new user',
    response: {
      status: 201,
      description: 'User registered successfully',
      type: AuthResponseDto,
    },
    errors: ['Bad request'],
    requireAuth: false,
  })
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
  @SwaggerEndpointDecorator({
    summary: 'Login a user',
    description: 'Login a user',
    response: {
      status: 200,
      description: 'User logged in successfully',
      type: AuthResponseDto,
    },
    errors: ['Invalid credentials'],
    requireAuth: false,
  })
  login(@Body() body: LoginRequestDto): Promise<AuthResponseDto> {
    return this.cqrsCaller.dispatch(
      new LoginCommand(body.email, body.password),
      {
        showCommand: false,
        showResult: false,
      },
    );
  }

  @Post('refresh')
  @SwaggerEndpointDecorator({
    summary: 'Refresh auth tokens',
    description: 'Generate a new session token and refresh token pair',
    response: {
      status: 200,
      description: 'Tokens refreshed successfully',
      type: AuthResponseDto,
    },
    errors: ['Invalid refresh token'],
    requireAuth: false,
  })
  refresh(@Body() body: RefreshTokenRequestDto): Promise<AuthResponseDto> {
    return this.cqrsCaller.dispatch(
      new RefreshTokenCommand(body.refreshToken),
      {
        showCommand: false,
        showResult: false,
      },
    );
  }
}
