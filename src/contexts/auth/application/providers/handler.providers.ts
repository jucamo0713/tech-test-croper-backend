import {
  LoginCommandHandler,
  RefreshTokenCommandHandler,
  RegisterCommandHandler,
} from '@auth/infrastructure/ui/cqrs-handlers/command-handlers';

export const CommandHandlers = [
  RegisterCommandHandler,
  LoginCommandHandler,
  RefreshTokenCommandHandler,
];
export const QueryHandlers = [];
export const EventHandlers = [];
