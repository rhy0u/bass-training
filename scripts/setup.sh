#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Setting up Friends project..."

# 1. Copy env file if missing
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env from .env.example"
else
  echo "ℹ️  .env already exists, skipping"
fi

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 3. Start Docker services
echo "🐳 Starting Docker services (Postgres, Redis, Nginx)..."
docker compose up -d

# 4. Wait for Postgres to be ready
echo "⏳ Waiting for PostgreSQL..."
until docker compose exec postgres pg_isready -U friends_user -d friends_db > /dev/null 2>&1; do
  sleep 1
done
echo "✅ PostgreSQL is ready"

# 5. Generate Prisma client & push schema
echo "🔧 Generating Prisma client..."
npm run db:generate

echo "📐 Pushing database schema..."
npm run db:push

# 6. Seed the database
echo "🌱 Seeding database..."
npm run db:seed

# 7. Add hosts entry reminder
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Add this to your /etc/hosts file:"
echo "   127.0.0.1  friends.local"
echo ""
echo "   sudo sh -c 'echo \"127.0.0.1  friends.local\" >> /etc/hosts'"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Setup complete! Run 'npm run dev' and visit http://friends.local"
