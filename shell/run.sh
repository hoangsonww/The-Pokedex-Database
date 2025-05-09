#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="docker-compose.yml"

print_help() {
  cat <<EOF
Usage: $0 <command>

Commands:
  up        Build images and start both services (frontend & backend)
  down      Stop and remove containers, networks
  logs      Stream logs from both services
  restart   Equivalent to 'down' then 'up'
  clean     Remove all containers, networks, volumes, and images for this project
  help      Show this help message
EOF
}

if [ $# -lt 1 ]; then
  print_help
  exit 1
fi

cmd="$1"

case "$cmd" in
  up)
    echo "🔨 Building and starting containers..."
    docker-compose -f "$COMPOSE_FILE" up --build -d
    echo "✅ Services are up and running."
    ;;
  down)
    echo "🛑 Stopping and removing containers..."
    docker-compose -f "$COMPOSE_FILE" down
    echo "✅ Containers stopped."
    ;;
  logs)
    echo "📜 Streaming logs (CTRL+C to exit)..."
    docker-compose -f "$COMPOSE_FILE" logs -f
    ;;
  restart)
    echo "🔄 Restarting services..."
    docker-compose -f "$COMPOSE_FILE" down
    docker-compose -f "$COMPOSE_FILE" up --build -d
    echo "✅ Restart complete."
    ;;
  clean)
    echo "🧹 Cleaning up all containers, networks, volumes, and images..."
    docker-compose -f "$COMPOSE_FILE" down --rmi all --volumes --remove-orphans
    echo "✅ Cleanup complete."
    ;;
  help|--help|-h)
    print_help
    ;;
  *)
    echo "❌ Unknown command: $cmd"
    print_help
    exit 1
    ;;
esac
