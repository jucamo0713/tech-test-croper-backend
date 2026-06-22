import {
  LoginCommandHandler,
  RegisterCommandHandler,
} from '@auth/infrastructure/ui/cqrs-handlers/command-handlers';

export const CommandHandlers = [RegisterCommandHandler, LoginCommandHandler];
export const QueryHandlers = [];
export const EventHandlers = [];
