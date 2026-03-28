
POSTGRES_USER="${POSTGRES_USER:-bass-training_user}"
POSTGRES_DB="${POSTGRES_DB:-bass-training_db}"
#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Setting up Boilerplate project..."

# ── Detect project name for certs/hosts ─────────────
PROJECT_NAME=$(node -p "require('./package.json').name" 2>/dev/null || echo "boilerplate")
PROJECT_DOMAIN="$PROJECT_NAME.local"

# 1. Copy env file if missing
if [ ! -f .env ]; then
  cp .env.example .env
  echo "✅ Created .env from .env.example"
else
  echo "ℹ️  .env already exists, skipping"
fi

# 2. Install dependencies
echo "📦 Installing dependencies..."
yarn install

# 3. Generate local HTTPS certificates with mkcert
echo "🔒 Setting up local HTTPS certificates..."
if ! command -v mkcert &> /dev/null; then
  echo "  Installing mkcert..."
  brew install mkcert
fi
mkcert -install
cd docker/nginx/certs
mkcert -key-file "$PROJECT_DOMAIN.key" -cert-file "$PROJECT_DOMAIN.crt" "$PROJECT_DOMAIN" localhost 127.0.0.1
cd -
echo "✅ Certificates ready"

# 4. Start Docker services
echo "🐳 Starting Docker services (Postgres, Redis, Nginx)..."
docker compose up -d

# 4. Wait for Postgres to be ready
echo "⏳ Waiting for PostgreSQL..."
until docker compose exec postgres pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" > /dev/null 2>&1; do
  sleep 1
done
echo "✅ PostgreSQL is ready"

# 5. Generate Prisma client & push schema
echo "🔧 Generating Prisma client..."
yarn db:generate

echo "📐 Pushing database schema..."
yarn db:push

# 6. Seed the database
echo "🌱 Seeding database..."
yarn db:seed

# 7. Add hosts entry reminder
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Add this to your /etc/hosts file:"
echo "   127.0.0.1  $PROJECT_DOMAIN"
echo ""
echo "   sudo sh -c 'echo \"127.0.0.1  $PROJECT_DOMAIN\" >> /etc/hosts'"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Setup complete! Run 'yarn dev' and visit http://$PROJECT_DOMAIN"
