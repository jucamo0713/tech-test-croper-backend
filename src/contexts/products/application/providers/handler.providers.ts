import {
  CreateProductCommandHandler,
  DeleteProductCommandHandler,
  UpdateProductCommandHandler,
} from '@products/infrastructure/ui/cqrs-handlers/command-handlers';
import {
  GetPaginatedProductsQueryHandler,
  GetProductByIdQueryHandler,
} from '@products/infrastructure/ui/cqrs-handlers/query-handlers';

export const CommandHandlers = [
  CreateProductCommandHandler,
  UpdateProductCommandHandler,
  DeleteProductCommandHandler,
];
export const QueryHandlers = [
  GetProductByIdQueryHandler,
  GetPaginatedProductsQueryHandler,
];
export const EventHandlers = [];
