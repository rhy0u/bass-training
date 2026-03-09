FROM node:20-alpine AS base

# ── Dependencies ──────────────────────────────────────────
FROM base AS deps
WORKDIR /app

COPY package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/

RUN npm install

# ── Prisma Generate ──────────────────────────────────────
FROM base AS prisma
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY packages/database ./packages/database

RUN npx prisma generate --schema=packages/database/prisma/schema.prisma

# ── Build ─────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma /app/node_modules/.prisma ./node_modules/.prisma
COPY . .

RUN npm run build --workspace=packages/database
RUN npm run build --workspace=apps/web

# ── Production ────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
