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

`SharedModule` must centralize:

- `ConfigModule.forRoot`
- Joi validation schema
- `CqrsModule`
- shared Mongo/Mongoose connection module
- common shared providers

Context-specific Mongo/Mongoose models are infrastructure details. They must not be used directly by domain, controllers, handlers, or use cases.

## Environment Variables

The project uses `@nestjs/config` and `Joi` to validate environment variables at application startup.

The configuration lives in:

`src/contexts/shared/application/config`

The `SharedModule` is responsible for loading and validating the global configuration.

Current validated variables:

- `NODE_ENV`
- `PORT`
- `APP_NAME`
- `API_PREFIX`
- `LOG_LEVEL`
- `DEFAULT_TIMEOUT_MS`

Runtime usage:

- `PORT` is used by `src/main.ts` to choose the HTTP listen port.
- `API_PREFIX` is used by `src/main.ts` as the global API prefix.
- `LOG_LEVEL` is used by `src/main.ts` to configure Nest logger levels.
- `APP_NAME` and `NODE_ENV` are used by `src/main.ts` in the startup log.
- `DEFAULT_TIMEOUT_MS` is used by the global timeout interceptor when a handler does not define a custom timeout.

Global shared infrastructure providers:

- `AppLogger` is registered from `SharedModule` and used by `src/main.ts` as the Nest application logger.
- `HttpExceptionFilter` is registered globally through `APP_FILTER`.
- `LoggerInterceptor` is registered globally through `APP_INTERCEPTOR`.
- `TimeoutInterceptor` is registered globally through `APP_INTERCEPTOR`.

The validated defaults are:

```txt
NODE_ENV=development
PORT=3000
APP_NAME=nestjs-backend
API_PREFIX=api
LOG_LEVEL=log
DEFAULT_TIMEOUT_MS=30000
```

Environment validation must stay centralized in `shared`; feature contexts must not import `ConfigModule` directly or duplicate environment schemas.

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

The domain layer contains the business core. It must remain independent from infrastructure, application, controllers, handlers, and concrete adapters.

NestJS dependencies are generally not allowed in domain code, with one explicit exception: domain models and use cases may use NestJS HTTP error classes for error handling, such as `HttpException`, `BadRequestException`, `NotFoundException`, `ConflictException`, `UnauthorizedException`, `ForbiddenException`, and `InternalServerErrorException`.

CQRS is a project-level architectural decision. Domain CQRS contracts may use `type`-only imports from `@nestjs/cqrs`, such as `Command`, `Query`, `IEvent`, `CommandResult`, or `QueryResult`, when those types preserve compile-time inference for command/query results or define cross-context CQRS contracts. These imports must remain type-only and must not introduce runtime NestJS framework usage in domain code.

Do not use NestJS decorators, modules, providers, dependency injection, `ConfigService`, buses, controllers, handlers, interceptors, filters, pipes, or concrete adapters from the domain layer.

## Domain Models

`domain/models` contains the extended domain model:

- entities
- value objects
- cqrs
- gateways

Domain models should be as pure as possible.

Domain models may throw NestJS HTTP errors when validation fails or when a domain invariant cannot be satisfied. They must not use other NestJS framework features.

## Domain Entities

Domain entities live in:

- `src/contexts/users/domain/models/entities`
- `src/contexts/products/domain/models/entities`

Entity files may use the `.entity.ts` suffix, but exported entity classes must not use the `Entity` suffix.

Correct:

- `User`
- `Product`

Incorrect:

- `UserEntity`
- `ProductEntity`

The goal is to keep domain usage readable:

```ts
const user = new User(props);
const product = new Product(props);
```

Entities are pure domain objects.

They must not import:

- NestJS
- Mongoose
- infrastructure DTOs
- database schemas
- providers
- controllers
- handlers
- adapters
- use cases

Entities may use value objects from the domain model.

Product entities must reuse existing value objects or domain types for multilanguage fields and multi-price fields.

Entities should expose clear constructors and getters.

Entities should not contain full use-case logic.

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

Commands live in `domain/models/cqrs/commands`. They are simple objects, contain no business logic, and are named as imperative actions such as `CreateUserCommand`. They may extend or use CQRS base types when needed for typed result inference, but only as part of the CQRS contract.

## Queries

Queries live in `domain/models/cqrs/queries`. They are simple objects, contain no business logic, and are named as information requests such as `GetUserByIdQuery`. They may extend or use CQRS base types when needed for typed result inference, but only as part of the CQRS contract.

## Events

Events live in `domain/models/cqrs/events`. They represent facts that already happened, are immutable simple objects, contain only necessary data, and are named in the past such as `UserCreatedDomainEvent`.

## Domain Gateways inside Models

Gateway interfaces live in `domain/models/gateways`. Gateways are contracts only and must not contain concrete implementations.

Use constants or symbols for injection tokens instead of loose strings when tokens are needed.

## Domain Use Cases

Use cases live in `domain/use-cases`. They contain business logic and may depend on domain models, value objects, commands, queries, events, and gateway interfaces.

Use cases must not import controllers, handlers, concrete adapters, application, infrastructure, or use cases from another context.

Use cases may use NestJS HTTP errors for error handling only. They must not use other NestJS framework features.

## Error Handling

The project allows NestJS HTTP error classes for application and domain error handling.

Allowed examples:

```ts
throw new BadRequestException('Invalid email');
throw new NotFoundException('User not found');
throw new ConflictException('Email already exists');
```

These exceptions are limited to error classes from `@nestjs/common` and type-only CQRS contract imports from `@nestjs/cqrs`. They do not allow using NestJS dependency injection, modules, controllers, handlers, interceptors, pipes, filters, `ConfigService`, CQRS buses, or infrastructure dependencies inside domain code.

Shared infrastructure may also use NestJS filters and interceptors to normalize and log errors globally.

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

## Database Models

Mongo/Mongoose models are infrastructure details.

They live inside each context infrastructure layer.

Users model files:

- `src/contexts/users/infrastructure/database/user.model.ts`
- `src/contexts/users/infrastructure/database/database-user-model.provider.ts`
- `src/contexts/users/infrastructure/database/database-user-config.constants.ts`

Products model files:

- `src/contexts/products/infrastructure/database/product.model.ts`
- `src/contexts/products/infrastructure/database/database-product-model.provider.ts`
- `src/contexts/products/infrastructure/database/database-product-config.constants.ts`

Persistence DTOs live in:

- `src/contexts/users/infrastructure/dtos`
- `src/contexts/products/infrastructure/dtos`

Use cases, handlers and controllers must not use Mongoose models directly.

Concrete database adapters or repositories are responsible for using these models.

Model providers must register models against the shared Mongoose connection. They must not create new database connections.

## Product Value Objects

Product schemas must reuse the existing value objects or shared persistence structures for multilanguage fields and multi-price fields.

Do not duplicate multilanguage or multi-price structures.

Do not create new value object shapes if they already exist in the project.

## CqrsCaller

The project has one shared `CqrsCaller` implementation in `shared`.

Controllers must use `CqrsCaller` to execute commands or queries.

Controllers must not inject `CommandBus`, `QueryBus`, or `EventBus` directly.

Adapters that need CQRS communication across contexts must use the shared `CqrsCaller` when CQRS is the chosen integration mechanism.

Use cases must not depend on `CqrsCaller`.

Use cases must depend on domain gateways.

`CqrsCaller` centralizes CQRS execution and avoids duplicating transversal dispatch/query/event logic.

## Auth Flows

Register and login live as HTTP entry points in the `auth` context.

`AuthController` uses `CqrsCaller`.

`AuthController` must not use `CommandBus`, `QueryBus`, or `EventBus` directly.

`RegisterCommand` and `LoginCommand` live in `auth/domain/models/cqrs/commands`.

`RegisterCommandHandler` and `LoginCommandHandler` live in `auth/infrastructure/ui/cqrs-handlers/command-handlers`.

`RegisterUseCase` and `LoginUseCase` live in `auth/domain/use-cases`.

Auth communicates with users through a gateway defined in `auth/domain/models/gateways`.

The gateway implementation lives in `auth/infrastructure/driven-adapters` and uses `CqrsCaller` to execute CQRS messages against users.

Users exposes commands and queries to create and query users.

Users handles user persistence through its own gateway and adapter.

Password hashing and password comparison utilities live in shared and must be reused.

Duplicating password hashing or password comparison logic is forbidden.

Register must never persist plain text passwords. Users receives and persists `passwordHash`.

Login must never return `passwordHash`.

Register and login return both a session token and a refresh token.

Tokens must be generated through the shared `TokenRepository`.

Token secrets and expirations must come from validated environment variables:

- `SESSION_TOKEN_SECRET`
- `SESSION_TOKEN_EXPIRES_IN_SECONDS`
- `REFRESH_TOKEN_SECRET`
- `REFRESH_TOKEN_EXPIRES_IN_SECONDS`

Do not hardcode token secrets or expirations.

Session token validation is handled by the shared `JwtSessionGuard`.

## Dependency Rules

Allowed direction:

```txt
application -> domain
application -> infrastructure
infrastructure -> domain
domain -> no outer layer
```

Exceptions: domain code may import NestJS HTTP error classes from `@nestjs/common` for error handling only, and may use type-only CQRS imports from `@nestjs/cqrs` for architectural command/query/event contracts and result inference.

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
  database.providers.ts
  handler.providers.ts
  index.ts
```

Register use cases in `UseCaseProviders`, gateway token mappings in `GatewayProviders`, database model providers in `DatabaseProviders`, and CQRS handlers in `CommandHandlers`, `QueryHandlers`, and `EventHandlers`.

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
Controller -> Mongoose Model
Controller -> CommandBus directo
Controller -> QueryBus directo
Controller -> EventBus directo
AuthController -> CommandBus directo
AuthController -> QueryBus directo
AuthController -> EventBus directo
AuthController -> UserRepository
AuthController -> Mongoose Model
AuthController -> Users UseCase
Handler -> Repository concreto directamente
Handler -> Repository concreto
Handler -> Adapter concreto directamente
Handler -> Mongoose Model
Entity -> Mongoose
Entity -> NestJS
Entity -> Infrastructure DTO
Entity -> Database Schema
Entity -> Database Provider
Entity -> Controller
Entity -> Handler
Entity -> Adapter
Entity -> UseCase
UseCase -> NestJS framework features, except HTTP error classes
UseCase -> Controller
UseCase -> Handler
UseCase -> Adapter concreto
UseCase -> Application
UseCase -> Infrastructure
UseCase -> Mongoose Model
Users UseCase -> Mongoose Model
Auth UseCase -> Users Infrastructure
Auth UseCase -> Users UseCase
Auth UseCase -> Mongoose Model
Auth UseCase -> CqrsCaller
Auth UseCase -> CommandBus
Auth UseCase -> QueryBus
Auth UseCase -> EventBus
Domain -> Mongoose
Context A -> UseCase de Context B
Context A -> Infrastructure de Context B
Context A -> Application de Context B
DTO usado como entidad de dominio
Gateway con implementación concreta dentro de domain/models/gateways
Cada contexto importando ConfigModule directamente sin pasar por SharedModule
Cada contexto importando CqrsModule directamente sin pasar por SharedModule
Class names ending in Entity for domain entities
UserEntity
ProductEntity
UserEntityProps
ProductEntityProps
Duplicating existing multilanguage value objects
Duplicating existing multi-price value objects
Creating database connection inside model provider
Duplicar CqrsCaller
Crear otro CqrsCaller
Duplicar hashing de password
Duplicar comparación de password
Guardar password plano
Retornar passwordHash
Hardcodear secretos
Crear JWT sin configuración previa
Tests unitarios conectándose a bases de datos reales
Tests sin estructura describe por clase y método
Tests ubicados fuera de la estructura equivalente a src
```
