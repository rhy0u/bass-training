# Friends

A monorepo project built with **Next.js**, **Prisma**, **PostgreSQL**, **Redis**, and **Nginx** reverse proxy.

## Architecture

```
friends/
├── apps/
│   └── web/                 # Next.js application
│       └── src/
│           ├── app/         # App Router pages
│           └── lib/         # Shared utilities (redis, etc.)
├── packages/
│   └── database/            # Prisma client & schema
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── seed.ts
│       └── src/
│           └── index.ts     # Prisma client singleton
├── docker/
│   └── nginx/               # Nginx reverse proxy config
│       ├── nginx.conf
│       └── conf.d/
│           └── friends.conf # Custom domain → Next.js
├── docker-compose.yml       # Postgres + Redis + Nginx
├── turbo.json               # Turborepo config
└── package.json             # Workspace root
```

## Quick Start

### Prerequisites

- Node.js ≥ 18
- Docker & Docker Compose

### Setup

```bash
# Make setup script executable and run it
chmod +x scripts/setup.sh
./scripts/setup.sh
```

Or manually:

```bash
# 1. Install dependencies
yarn install

# 2. Start Docker services
docker compose up -d

# 3. Generate Prisma client & push schema
yarn db:generate
yarn db:push

# 4. Seed the database
yarn db:seed

# 5. Add custom domain to hosts file
sudo sh -c 'echo "127.0.0.1  friends.local" >> /etc/hosts'

# 6. Start development
yarn dev
```

Visit **http://friends.local** in your browser.

## Commands

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `yarn dev`         | Start Next.js dev server       |
| `yarn build`       | Build for production           |
| `yarn docker:up`   | Start Postgres + Redis + Nginx |
| `yarn docker:down` | Stop Docker services           |
| `yarn docker:logs` | View Docker container logs     |
| `yarn db:generate` | Generate Prisma client         |
| `yarn db:push`     | Push schema to database        |
| `yarn db:migrate`  | Create & run migrations        |
| `yarn db:studio`   | Open Prisma Studio GUI         |
| `yarn db:seed`     | Seed the database              |

## Custom Domain

The Nginx reverse proxy maps `friends.local` → Next.js (port 3000).

Make sure your `/etc/hosts` contains:

```
127.0.0.1  friends.local
```

## Stack

- **Next.js 15** — React framework (App Router)
- **Prisma 6** — Type-safe database ORM
- **PostgreSQL 16** — Primary database
- **Redis 7** — Caching / sessions
- **Nginx** — Reverse proxy with custom domain
- **Turborepo** — Monorepo build orchestration
