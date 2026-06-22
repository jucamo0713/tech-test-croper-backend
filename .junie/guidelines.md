# Junie Guidelines

This backend uses NestJS with CQRS, Clean Architecture, DDD, and separated bounded contexts.

Follow these guidelines for code generation, refactors, inspections, and code reviews.

## Project Architecture

The initial contexts are:

- `users`
- `auth`
- `products`
- `shared`

Contexts live under `src/contexts`. Each context owns its module, domain model, use cases, infrastructure, and provider registration.

Each context follows:

```txt
application/
domain/
infrastructure/
```

Expected project structure:

```txt
src/
  app.module.ts
  contexts/
    users/
    auth/
    products/
    shared/
```

Expected context structure:

```txt
context-name/
  application/
    context-name.module.ts
    providers/
    config/
  domain/
    models/
    use-cases/
  infrastructure/
    driven-adapters/
    ui/
    dtos/
```

## Imports and Boundaries

Configured aliases:

```txt
@contexts  -> src/contexts
@users     -> src/contexts/users
@auth      -> src/contexts/auth
@products  -> src/contexts/products
@shared    -> src/contexts/shared
```

Use aliases for readable imports. Do not use aliases to bypass bounded-context rules.

Allowed dependency direction:

```txt
application -> domain
application -> infrastructure
infrastructure -> domain
domain -> no outer layer
```

No context may import another context's use cases, infrastructure, application layer, controllers, or handlers.

Cross-context communication must happen through CQRS. A context may import explicitly exported domain models, commands, queries, or events from another context only when they represent communication contracts.

If a use case needs another context, define a gateway in `domain/models/gateways` and implement it with a driven adapter that uses `CommandBus`, `QueryBus`, or `EventBus`.

## Shared Module

`SharedModule` is global and centralizes:

- `ConfigModule`
- `CqrsModule`
- common shared providers

Do not import `ConfigModule` or `CqrsModule` directly from each context. Use `SharedModule`.

## Database Restrictions

Mongoose and MongoDB are intentionally excluded from this iteration.

Do not add:

- `MongooseModule`
- MongoDB connection setup
- MongoDB environment variables such as `MONGODB_URI`
- Mongoose schemas
- MongoDB repositories
- MongoDB driven adapters

## Domain Layer

The domain layer contains the business core and must stay independent from NestJS runtime features, infrastructure, application, controllers, handlers, and concrete adapters.

CQRS is a project-level architectural decision. Domain CQRS contracts may use `type`-only imports from `@nestjs/cqrs`, such as `Command`, `Query`, `IEvent`, `CommandResult`, or `QueryResult`, when those types preserve compile-time inference for command/query results or define cross-context CQRS contracts. These imports must stay type-only and must not introduce NestJS decorators, buses, providers, dependency injection, or other runtime framework usage in domain code.

`domain/models` contains:

- entities
- value objects
- CQRS messages
- gateways

CQRS messages live under:

```txt
domain/models/cqrs/
  commands/
  queries/
  events/
```

Commands are simple imperative request objects, for example `CreateUserCommand`.

Queries are simple information request objects, for example `GetUserByIdQuery`.

Events are immutable past-tense facts, for example `UserCreatedDomainEvent`.

CQRS messages contain no business logic. They may use CQRS base types from `@nestjs/cqrs` only as type-level architectural contracts for result inference and command/query/event typing.

Gateway interfaces live in `domain/models/gateways`. They are contracts only and must not include concrete implementations. Use constants or symbols for injection tokens instead of loose strings.

Use cases live in `domain/use-cases`. They may depend on domain models, value objects, commands, queries, events, and gateway interfaces.

Use cases must not import:

- NestJS
- controllers
- handlers
- concrete adapters
- application layer
- infrastructure layer
- use cases from another context

## Application Layer

The application layer declares the contextual NestJS module and registers controllers, use cases, gateways, CQRS handlers, driven adapters, and context configuration.

It may depend on domain, infrastructure, NestJS, and shared modules. No other layer should depend on application.

Provider registration lives in:

```txt
application/providers/
  use-case.providers.ts
  gateway.providers.ts
  handler.providers.ts
  index.ts
```

Register use cases in `UseCaseProviders`.

Register gateway token mappings in `GatewayProviders`.

Register CQRS handlers in `CommandHandlers`, `QueryHandlers`, and `EventHandlers`.

## Infrastructure Layer

Infrastructure contains:

- driven adapters
- UI controllers
- CQRS handlers
- DTOs

Driven adapters live in `infrastructure/driven-adapters`. They implement gateway contracts from `domain/models/gateways` and may integrate with APIs, queues, technical services, or other contexts through CQRS.

Driven adapters must not import controllers, handlers, application layer, or use cases from other contexts.

The UI layer lives in `infrastructure/ui`.

Controllers live in `infrastructure/ui/controllers`. Controllers only receive requests, validate or map DTOs, create commands or queries, execute them through `CommandBus` or `QueryBus`, and return responses.

Controllers must not call use cases, repositories, or adapters directly.

Command handlers live in `infrastructure/ui/cqrs-handlers/command-handlers`. They receive commands and call use cases. They must not contain business logic or access concrete repositories or adapters directly.

Query handlers live in `infrastructure/ui/cqrs-handlers/query-handlers`. They receive queries and call use cases. They must not contain business logic or access concrete repositories or adapters directly.

Event handlers live in `infrastructure/ui/cqrs-handlers/event-handlers`. They react to domain events. They may call use cases or gateways for simple reactions, but must not duplicate business logic or access concrete repositories directly.

DTOs live in `infrastructure/dtos`. DTOs can be used by controllers, handlers, and driven adapters, but must not replace domain entities or contain business logic.

## Testing

Tests live in `tests` and replicate the `src` context structure.

Test folders:

```txt
tests/
  mothers-and-mocks/
  units/
  e2e/
```

Each test folder mirrors:

```txt
contexts/
  users/
  auth/
  products/
  shared/
```

Unit tests must mock external dependencies and must not connect to real databases or services.

E2E tests may bootstrap modules but must use testing configuration and no real credentials.

Tests must use:

```ts
describe('ClassName', () => {
  describe('methodName', () => {
    it('should ...', () => {});
  });
});
```

If a file contains multiple classes, add a top-level describe for the group, then describe each class and method.

## Review Checklist

Flag these as review issues:

- Controller calls a use case, repository, or adapter directly.
- Handler accesses a concrete repository or adapter directly.
- Use case imports NestJS, application, infrastructure, controllers, handlers, concrete adapters, or another context's use cases.
- Domain imports anything from application or infrastructure.
- Context imports another context's infrastructure, application, controllers, handlers, or use cases.
- DTO is used as a domain entity.
- Gateway interface contains a concrete implementation.
- Context imports `ConfigModule` or `CqrsModule` directly instead of using `SharedModule`.
- MongoDB, Mongoose, schemas, repositories, MongoDB adapters, or MongoDB env vars are introduced in this iteration.
- Unit tests connect to real databases or services.
- Tests do not mirror the source context structure.
- Tests do not use the class and method describe convention.
