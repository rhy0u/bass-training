#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────
#  init.sh — rename the boilerplate to your project name
#
#  Usage:
#    bash scripts/init.sh my-app
#    bash scripts/init.sh "My App"   (spaces become hyphens for slugs)
# ─────────────────────────────────────────────────────────────

if [ $# -lt 1 ]; then
  echo "Usage: bash scripts/init.sh <project-name>"
  echo "  e.g. bash scripts/init.sh my-app"
  exit 1
fi

RAW_NAME="$1"

# Derive variants from the raw name
# slug: lowercase, spaces → hyphens, only alphanumeric + hyphens
SLUG=$(echo "$RAW_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')
# pascal: capitalise first letter of each word (used for "Boilerplate" → "MyApp")
PASCAL=$(echo "$RAW_NAME" | sed 's/_/-/g' | awk -F'[-]' '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2); OFS=""}1')

if [ -z "$SLUG" ]; then
  echo "❌  Invalid project name: '$RAW_NAME'"
  exit 1
fi

echo "🔧 Initialising project as:"
echo "   slug  : $SLUG"
echo "   pascal: $PASCAL"
echo ""

# ── Guard: refuse to re-run if already initialised ──────────
if ! grep -qr "boilerplate\|Boilerplate" \
    --include="*.ts" --include="*.tsx" --include="*.json" \
    --include="*.yml" --include="*.yaml" --include="*.conf" \
    --include="*.properties" --include="*.mjs" --include="*.md" \
    --include="*.sh" --include="*.prisma" \
    --exclude-dir=node_modules --exclude-dir=.git \
    --exclude-dir=coverage --exclude-dir=.next \
    --exclude-dir=scripts \
    . 2>/dev/null; then
  echo "ℹ️  No 'boilerplate' references found — project may already be initialised."
  exit 0
fi

# ── Rename nginx conf file ───────────────────────────────────
NGINX_OLD="docker/nginx/conf.d/boilerplate.conf"
NGINX_NEW="docker/nginx/conf.d/${SLUG}.conf"
if [ -f "$NGINX_OLD" ]; then
  mv "$NGINX_OLD" "$NGINX_NEW"
  echo "✅ Renamed $NGINX_OLD → $NGINX_NEW"
fi

# ── Rename TLS cert files ─────────────────────────────────────
CERTS_DIR="docker/nginx/certs"
for f in "$CERTS_DIR"/boilerplate.*; do
  [ -f "$f" ] || continue
  NEW_F="${f/boilerplate/$SLUG}"
  mv "$f" "$NEW_F"
  echo "✅ Renamed $f → $NEW_F"
done

# ── Text replacements in all source files ────────────────────
# Order matters: longer/specific variants first to avoid partial replacements
python3 - "$SLUG" "$PASCAL" << 'PYEOF'
import os, sys

slug  = sys.argv[1]   # e.g. my-app
pascal = sys.argv[2]  # e.g. MyApp

root = os.getcwd()
skip_dirs = {'.git', 'node_modules', 'coverage', '.next', '.turbo', 'scripts'}
exts = {
  '.ts', '.tsx', '.json', '.yml', '.yaml', '.conf',
  '.properties', '.mjs', '.md', '.sh', '.prisma', '.example',
}
# Also match these extensionless filenames explicitly
explicit_names = {'Dockerfile'}

# Ordered pairs: (old, new) — most specific first
pairs = [
  ('Boilerplate', pascal),
  ('boilerplate', slug),
]

changed = []
for dirpath, dirnames, filenames in os.walk(root):
  dirnames[:] = [d for d in dirnames if d not in skip_dirs]
  for fname in filenames:
    _, ext = os.path.splitext(fname)
    if ext not in exts and fname not in explicit_names:
      continue
    fpath = os.path.join(dirpath, fname)
    try:
      with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()
    except Exception:
      continue
    new_content = content
    for old, new in pairs:
      new_content = new_content.replace(old, new)
    if new_content != content:
      with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_content)
      changed.append(fpath.replace(root + os.sep, ''))

for p in sorted(changed):
  print('  updated: ' + p)
print('Total files updated: ' + str(len(changed)))
PYEOF

echo ""
echo "✅ Done! All 'boilerplate' references replaced with '$SLUG' / '$PASCAL'."
echo ""
echo "Next steps:"
echo "  1. Run 'bash scripts/setup.sh' to install deps, start Docker and seed the DB."
echo "  2. Add '127.0.0.1  ${SLUG}.local' to /etc/hosts."
echo "  3. Run 'yarn dev' and open https://${SLUG}.local"
