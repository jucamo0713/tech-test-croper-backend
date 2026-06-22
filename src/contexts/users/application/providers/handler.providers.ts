import { CreateUserCommandHandler } from '@users/infrastructure/ui/cqrs-handlers/command-handlers';
import { GetUserByEmailQueryHandler } from '@users/infrastructure/ui/cqrs-handlers/query-handlers';

export const CommandHandlers = [CreateUserCommandHandler];
export const QueryHandlers = [GetUserByEmailQueryHandler];
export const EventHandlers = [];
