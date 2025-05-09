#!/usr/bin/env bash
set -euo pipefail

REPO_SSH="git@github.com:hoangsonww/The-Pokedex-Database.git"
REPO_HTTPS="https://github.com/hoangsonww/The-Pokedex-Database.git"
WEB_DIR="The-Pokedex-Database/web"

echo "🔄 Cloning Pokedex repo…"
if [ -d "The-Pokedex-Database" ]; then
  echo "  → Directory already exists, pulling latest"
  ( cd The-Pokedex-Database && git pull )
else
  git clone "${REPO_SSH}" || git clone "${REPO_HTTPS}"
fi

echo "📂 Entering web directory…"
cd "${WEB_DIR}"

echo "📦 Installing dependencies…"
npm install

echo "🚀 Starting dev server on http://localhost:3000 …"
npm run dev
