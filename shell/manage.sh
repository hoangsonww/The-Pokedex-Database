#!/usr/bin/env bash
set -euo pipefail

# CONFIG
REPO_SSH="git@github.com:hoangsonww/The-Pokedex-Database.git"
REPO_HTTPS="https://github.com/hoangsonww/The-Pokedex-Database.git"
WEB_PATH="The-Pokedex-Database/web"

# COLORS
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
CYAN="\033[0;36m"
RESET="\033[0m"

# Detect package manager
detect_pkg_mgr() {
  if command -v yarn >/dev/null 2>&1; then
    echo "yarn"
  else
    echo "npm"
  fi
}

# Clone or update the repo
cmd_clone() {
  echo -e "${CYAN}→ Cloning or updating the repo…${RESET}"
  if [ -d "${WEB_PATH}" ]; then
    echo "  Repo directory exists; pulling latest changes"
    git -C "$(dirname "${WEB_PATH}")" pull
  else
    git clone "${REPO_SSH}" || git clone "${REPO_HTTPS}"
  fi
}

# Install deps
cmd_install() {
  echo -e "${CYAN}→ Installing dependencies…${RESET}"
  local mgr
  mgr=$(detect_pkg_mgr)
  pushd "${WEB_PATH}" >/dev/null
    if [ "$mgr" = "yarn" ]; then
      yarn install
    else
      npm install
    fi
  popd >/dev/null
}

# Run dev server
cmd_dev() {
  echo -e "${GREEN}→ Starting dev server at http://localhost:3000${RESET}"
  local mgr
  mgr=$(detect_pkg_mgr)
  pushd "${WEB_PATH}" >/dev/null
    if [ "$mgr" = "yarn" ]; then
      yarn dev
    else
      npm run dev
    fi
  popd >/dev/null
}

# Build production
cmd_build() {
  echo -e "${GREEN}→ Building production bundle…${RESET}"
  local mgr
  mgr=$(detect_pkg_mgr)
  pushd "${WEB_PATH}" >/dev/null
    if [ "$mgr" = "yarn" ]; then
      yarn build
    else
      npm run build
    fi
  popd >/dev/null
  echo -e "${GREEN}✔ Build complete.${RESET}"
}

# Clean node_modules and .next
cmd_clean() {
  echo -e "${YELLOW}→ Cleaning dependencies and build output…${RESET}"
  rm -rf "${WEB_PATH}/node_modules" "${WEB_PATH}/.next"
  echo -e "${YELLOW}✔ Clean complete.${RESET}"
}

# Show usage
cmd_help() {
  cat <<EOF
Usage: ./manage.sh <command>

Commands:
  clone      Clone or update the GitHub repo
  install    Install dependencies (npm or yarn)
  dev        Start the development server
  build      Build for production
  clean      Remove node_modules and .next
  all        Run clone → install → dev
  help       Show this help message

Examples:
  ./manage.sh clone
  ./manage.sh install
  ./manage.sh dev
  ./manage.sh build
  ./manage.sh clean
  ./manage.sh all
EOF
}

# Main dispatch
if [ $# -lt 1 ]; then
  cmd_help
  exit 1
fi

case "$1" in
  clone)   cmd_clone ;;
  install) cmd_install ;;
  dev)     cmd_dev ;;
  build)   cmd_build ;;
  clean)   cmd_clean ;;
  all)
    cmd_clone
    cmd_install
    cmd_dev
    ;;
  help|*)  cmd_help ;;
esac
