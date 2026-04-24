#!/usr/bin/env bash
set -euo pipefail

# Runs the FastAPI service with uv + uvicorn.
#
# Usage:
#   ./dev.sh
#   PORT=8080 ./dev.sh
#
# Notes:
# - This script lives in services/vision-api and is safe to run from anywhere.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

export PATH="${HOME}/.local/bin:${PATH}"

if ! command -v uv >/dev/null 2>&1; then
  echo "error: uv not found. Install with:" >&2
  echo "  curl -LsSf https://astral.sh/uv/install.sh | sh" >&2
  echo "  echo 'export PATH=\"\$HOME/.local/bin:\$PATH\"' >> ~/.zshrc" >&2
  exit 1
fi

uv sync

PORT="${PORT:-8000}"
HOST="${HOST:-0.0.0.0}"
RELOAD="${RELOAD:-1}"

if [[ "$RELOAD" == "1" || "$RELOAD" == "true" || "$RELOAD" == "yes" ]]; then
  exec uv run uvicorn app.main:app --reload --host "$HOST" --port "$PORT"
else
  exec uv run uvicorn app.main:app --host "$HOST" --port "$PORT"
fi
