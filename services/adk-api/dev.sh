#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if [ ! -f ".env" ]; then
  echo "No .env found. Copying from .env.example"
  cp .env.example .env
  echo "Update services/adk-api/.env before using real keys."
fi

uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8010

