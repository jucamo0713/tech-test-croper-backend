# Project Architecture

## Architectural Style

This backend uses NestJS with CQRS, Clean Architecture, DDD, and separated bounded contexts.

The initial contexts are:

- `users`
- `auth`
- `products`
- `shared`

Each context follows this base structure:

```txt
application/
domain/
infrastructure/
```

## Contexts

Contexts live under `src/contexts`. Each context owns its module, domain model, use cases, infrastructure, and provider registration.

No context may import another context's use cases, infrastructure, application layer, controllers, or handlers.

Configured TypeScript aliases:

```txt
@contexts  -> src/contexts
@users     -> src/contexts/users
@auth      -> src/contexts/auth
@products  -> src/contexts/products
@shared    -> src/contexts/shared
```

Use aliases to keep imports readable, but do not use them to bypass cross-context dependency rules.

## Shared Module

The `SharedModule` is a global module responsible for common project-level imports and providers.

In this iteration, `SharedModule` must centralize:

- `ConfigModule`
- `CqrsModule`
- common shared providers

The project will use Mongoose in a future iteration, but Mongoose must not be configured yet.

Do not configure in this iteration:

- `MongooseModule`
- MongoDB connection
- MongoDB environment variables
- Mongoose schemas
- MongoDB repositories
- MongoDB driven adapters

Mongoose and database configuration will be added later in a separate iteration.

## Folder Structure

```txt
src/
  app.module.ts
  contexts/
    users/
    auth/
    products/
    shared/
```

Each context uses:

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

## Layer Responsibilities

The `application` layer integrates and registers dependencies. The `domain` layer contains the business core. The `infrastructure` layer contains technical implementations, adapters, controllers, handlers, and DTOs.

## Application Layer

The application layer declares the contextual NestJS module and registers controllers, use cases, gateways, CQRS handlers, driven adapters, and context configuration.

It may depend on `domain`, `infrastructure`, NestJS, and shared modules. No other layer should depend on `application`.

## Domain Layer

The domain layer contains the business core. It must remain independent from NestJS, infrastructure, application, controllers, handlers, and concrete adapters.

## Domain Models

`domain/models` contains the extended domain model:

- entities
- value objects
- cqrs
- gateways

Domain models should be as pure as possible.

## Domain CQRS inside Models

CQRS messages live inside `domain/models/cqrs`:

```txt
commands/
queries/
events/
```

Command = requests an action to be executed.
Query = requests information to be read.
Event = reports that something already happened.

## Commands

Commands live in `domain/models/cqrs/commands`. They are simple objects, contain no business logic, do not depend on NestJS, and are named as imperative actions such as `CreateUserCommand`.

## Queries

Queries live in `domain/models/cqrs/queries`. They are simple objects, contain no business logic, do not depend on NestJS, and are named as information requests such as `GetUserByIdQuery`.

## Events

Events live in `domain/models/cqrs/events`. They represent facts that already happened, are immutable simple objects, contain only necessary data, and are named in the past such as `UserCreatedDomainEvent`.

## Domain Gateways inside Models

Gateway interfaces live in `domain/models/gateways`. Gateways are contracts only and must not contain concrete implementations.

Use constants or symbols for injection tokens instead of loose strings when tokens are needed.

## Domain Use Cases

Use cases live in `domain/use-cases`. They contain business logic and may depend on domain models, value objects, commands, queries, events, and gateway interfaces.

Use cases must not import NestJS, controllers, handlers, concrete adapters, application, infrastructure, or use cases from another context.

## Infrastructure Layer

Infrastructure contains technical details:

- driven adapters
- UI controllers
- CQRS handlers
- DTOs

## Driven Adapters

Driven adapters live in `infrastructure/driven-adapters`. They implement gateway contracts from `domain/models/gateways` and may integrate with APIs, queues, technical services, or other contexts through CQRS.

They must not import controllers, handlers, application, or use cases from other contexts.

## UI Layer

The UI layer lives in `infrastructure/ui` and contains controllers plus CQRS handlers.

## Controllers

Controllers live in `infrastructure/ui/controllers`. Controllers only receive requests, validate or map DTOs, create commands or queries, execute them through `CommandBus` or `QueryBus`, and return responses.

Controllers must not call use cases, repositories, or adapters directly.

## Command Handlers

Command handlers live in `infrastructure/ui/cqrs-handlers/command-handlers`. They receive commands and call use cases. They must not contain business logic or access concrete repositories or adapters directly.

## Query Handlers

Query handlers live in `infrastructure/ui/cqrs-handlers/query-handlers`. They receive queries and call use cases. They must not contain business logic or access concrete repositories or adapters directly.

## Event Handlers

Event handlers live in `infrastructure/ui/cqrs-handlers/event-handlers`. They react to domain events. They may call use cases or gateways for simple reactions, but must not duplicate business logic or access concrete repositories directly.

## DTOs

DTOs live in `infrastructure/dtos`. They can be used by controllers, handlers, and driven adapters, but must not replace domain entities or contain business logic.

## Dependency Rules

Allowed direction:

```txt
application -> domain
application -> infrastructure
infrastructure -> domain
domain -> no outer layer
```

The application layer is the only place responsible for integrating providers, handlers, controllers, and adapters.

## Cross-Context Communication

Cross-context communication must happen through CQRS.

A context may import only explicitly exported domain models, commands, queries, or events from another context when they represent communication contracts.

If a use case needs another context, define a gateway in `domain/models/gateways` and implement it with a driven adapter that uses `CommandBus`, `QueryBus`, or `EventBus`.

## Provider Registration

Each context registers providers through:

```txt
application/providers/
  use-case.providers.ts
  gateway.providers.ts
  handler.providers.ts
  index.ts
```

Register use cases in `UseCaseProviders`, gateway token mappings in `GatewayProviders`, and CQRS handlers in `CommandHandlers`, `QueryHandlers`, and `EventHandlers`.

## Testing Architecture

Tests live in `tests` and replicate the `src` context structure. Unit tests must mock external dependencies and must not connect to real databases or services. E2E tests may bootstrap modules but must use testing configuration and no real credentials.

## Test Folder Structure

```txt
tests/
  mothers-and-mocks/
  units/
  e2e/
```

Each of those folders mirrors:

```txt
contexts/
  users/
  auth/
  products/
  shared/
```

`mothers-and-mocks` contains object mothers, builders, mocks, stubs, fakes, and fixtures. `units` contains unit tests. `e2e` contains end-to-end tests.

## Test Describe Convention

Tests must use this structure:

```ts
describe('ClassName', () => {
  describe('methodName', () => {
    it('should ...', () => {});
  });
});
```

If a file contains multiple classes, add a top-level describe for the group, then describe each class and method.

## How to add a new use case

1. Create the command or query in `domain/models/cqrs/commands` or `domain/models/cqrs/queries`.
2. Create the event in `domain/models/cqrs/events` if the use case must publish a domain fact.
3. Create or update entities and value objects in `domain/models` if applicable.
4. Create a gateway interface in `domain/models/gateways` if the use case needs external integration.
5. Create the use case in `domain/use-cases`.
6. Create a driven adapter in `infrastructure/driven-adapters` if a technical implementation is needed.
7. Create a command handler, query handler, or event handler in `infrastructure/ui/cqrs-handlers`.
8. Register the use case in `application/providers/use-case.providers.ts`.
9. Register gateways in `application/providers/gateway.providers.ts`.
10. Register handlers in `application/providers/handler.providers.ts`.
11. Expose an endpoint in a controller if applicable.
12. Create unit tests in the equivalent route inside `tests/units`.
13. Create mothers, mocks, or builders in the equivalent route inside `tests/mothers-and-mocks`.
14. Create e2e tests in `tests/e2e` if applicable.
15. Ensure dependency rules are not broken.

## Forbidden Patterns

```txt
Controller -> UseCase directly
Controller -> Repository directly
Controller -> Adapter directly
Handler -> Repository concreto directamente
Handler -> Adapter concreto directamente
UseCase -> NestJS
UseCase -> Controller
UseCase -> Handler
UseCase -> Adapter concreto
UseCase -> Application
UseCase -> Infrastructure
Context A -> UseCase de Context B
Context A -> Infrastructure de Context B
Context A -> Application de Context B
DTO usado como entidad de dominio
Gateway con implementación concreta dentro de domain/models/gateways
Cada contexto importando ConfigModule directamente sin pasar por SharedModule
Cada contexto importando CqrsModule directamente sin pasar por SharedModule
Configurar MongoDB en esta iteración
Configurar Mongoose en esta iteración
Crear schemas de Mongoose en esta iteración
Crear adapters de MongoDB en esta iteración
Crear repositories concretos de MongoDB en esta iteración
Agregar variables como MONGODB_URI todavía
Tests unitarios conectándose a bases de datos reales
Tests sin estructura describe por clase y método
Tests ubicados fuera de la estructura equivalente a src
```
