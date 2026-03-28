# Bass Training

A full-stack monorepo bass-training with **Next.js**, **Prisma**, **PostgreSQL**, **Redis**, **Nginx**, and built-in auth — ready to rename and ship.

## Features

- **Authentication** — Sign-up, sign-in, session management (Redis), profile & password update
- **i18n** — 5 languages (EN, FR, DE, ES, PT) via `next-intl`
- **UI package** — Shared component library (`@bass-training/ui`) with Storybook & Chromatic
- **Dark mode** — Flash-free theme toggle persisted in `localStorage`
- **Database** — Prisma + PostgreSQL with a pre-wired singleton client
- **Reverse proxy** — Nginx with custom local domain and HTTPS via `mkcert`
- **Testing** — Vitest + Testing Library with coverage reports
- **CI** — GitHub Actions pipeline (lint, test, build)

## Architecture

```
bass-training/
├── apps/
│   └── web/                    # Next.js 15 application (App Router)
│       ├── src/
│       │   ├── app/            # Routes, layouts, server actions
│       │   ├── components/     # Shared UI (Navbar, LocaleSwitcher, …)
│       │   ├── i18n/           # next-intl routing & config
│       │   └── lib/            # Auth, Redis session helpers
│       └── messages/           # Translation files (en/fr/de/es/pt)
├── packages/
│   ├── database/               # Prisma client & schema
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # User model (extend here)
│   │   │   └── seed.ts
│   │   └── src/index.ts        # Prisma singleton
│   └── ui/                     # Shared component library
│       └── src/                # Button, Input, Dialog, Menu, …
├── docker/
│   └── nginx/                  # Reverse proxy
│       ├── nginx.conf
│       └── conf.d/
│           └── bass-training.conf
├── scripts/
│   ├── init.sh                 # 🔑 Rename bass-training → your project
│   └── setup.sh                # First-run setup (deps, Docker, DB, certs)
├── docker-compose.yml          # Postgres + Redis + Nginx
├── turbo.json                  # Turborepo pipeline
└── package.json                # Workspace root
```

## Getting Started

### 1. Rename the project

```bash
# Replaces every "bass-training" reference with your project name
yarn init-project my-app
# or with spaces (auto-converts to slug + PascalCase)
yarn init-project "My App"
```

This renames package names, Docker container names, Nginx config, translation strings, and every other reference throughout the codebase.

### 2. Run setup

```bash
bash scripts/setup.sh
```

The setup script will:
1. Copy `.env.example` → `.env`
2. Install dependencies (`yarn install`)
3. Generate local HTTPS certs with `mkcert`
4. Start Docker services (Postgres, Redis, Nginx)
5. Push the Prisma schema and seed the database

### 3. Add the local domain to `/etc/hosts`

```bash
sudo sh -c 'echo "127.0.0.1  my-app.local" >> /etc/hosts'
```

### 4. Start developing

```bash
yarn dev
```

Visit **https://my-app.local** in your browser.

---

## Manual Setup (without the script)

```bash
yarn install
docker compose up -d
yarn db:generate && yarn db:push && yarn db:seed
yarn dev
```

---

## Commands

| Command                          | Description                       |
| -------------------------------- | --------------------------------- |
| `yarn init-project <name>`       | Rename bass-training to your project |
| `yarn dev`                       | Start Next.js dev server          |
| `yarn build`                     | Build for production              |
| `yarn test`                      | Run all tests                     |
| `yarn test:coverage`             | Run tests with coverage report    |
| `yarn lint`                      | Lint all packages                 |
| `yarn docker:up`                 | Start Postgres + Redis + Nginx    |
| `yarn docker:down`               | Stop Docker services              |
| `yarn docker:logs`               | View Docker container logs        |
| `yarn db:generate`               | Generate Prisma client            |
| `yarn db:push`                   | Push schema to database           |
| `yarn db:migrate`                | Create & run migrations           |
| `yarn db:studio`                 | Open Prisma Studio GUI            |
| `yarn db:seed`                   | Seed the database                 |
| `yarn storybook`                 | Open the UI component explorer    |

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```env
DATABASE_URL=postgresql://bass-training_user:change_me_in_production@localhost:5432/bass-training_db
REDIS_URL=redis://localhost:6379
SESSION_SECRET=change_me_to_a_long_random_string
```

## Stack

| Layer | Technology |
| ----- | ---------- |
| Framework | Next.js 15 (App Router) |
| ORM | Prisma 6 |
| Database | PostgreSQL 16 |
| Cache / Sessions | Redis 7 |
| Reverse proxy | Nginx |
| Auth | Custom (bcrypt + Redis sessions) |
| i18n | next-intl |
| UI | Custom `@bass-training/ui` (Radix-based) |
| Styling | Tailwind CSS |
| Testing | Vitest + Testing Library |
| Build system | Turborepo |
| CI | GitHub Actions |
