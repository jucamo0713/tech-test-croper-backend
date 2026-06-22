# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-backend,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm run build

FROM base AS prod-deps
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-backend-prod,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM node:22-bookworm-slim AS runner
ENV NODE_ENV=production
WORKDIR /app

RUN useradd --system --uid 1001 --create-home nodeapp

COPY --from=prod-deps --chown=nodeapp:nodeapp /app/node_modules ./node_modules
COPY --from=build --chown=nodeapp:nodeapp /app/dist ./dist
COPY --from=build --chown=nodeapp:nodeapp /app/package.json ./package.json

USER nodeapp
EXPOSE 3000
CMD ["node", "dist/main.js"]
