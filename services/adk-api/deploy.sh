#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="aevio-479110"
REGION="asia-southeast1"
SERVICE="adk-api"
IMAGE="gcr.io/${PROJECT_ID}/${SERVICE}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "${SCRIPT_DIR}/.env" ]; then
  echo "ERROR: No .env found at ${SCRIPT_DIR}/.env"
  exit 1
fi

echo "==> Loading env vars from .env"
ENV_VARS_FILE=$(mktemp /tmp/env-vars-XXXXXX.yaml)
trap "rm -f ${ENV_VARS_FILE}" EXIT

while IFS='=' read -r key value; do
  [[ -z "$key" || "$key" =~ ^# ]] && continue
  key=$(echo "$key" | xargs)
  [[ -z "$value" ]] && continue
  value="${value%\"}"
  value="${value#\"}"
  value="${value%\'}"
  value="${value#\'}"
  printf '%s: "%s"\n' "$key" "$value" >> "${ENV_VARS_FILE}"
done < "${SCRIPT_DIR}/.env"

echo "==> Building container image"
gcloud builds submit --tag "${IMAGE}" "${SCRIPT_DIR}"

echo "==> Deploying to Cloud Run"
gcloud run deploy "${SERVICE}" \
  --image "${IMAGE}" \
  --region "${REGION}" \
  --memory 1Gi \
  --cpu 1 \
  --allow-unauthenticated \
  --env-vars-file="${ENV_VARS_FILE}" \
  --quiet

echo "==> Verifying health"
SERVICE_URL=$(gcloud run services describe "${SERVICE}" --region "${REGION}" --format="value(status.url)")
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}/health")

if [ "$HTTP_STATUS" = "200" ]; then
  echo "==> Deploy successful: ${SERVICE_URL}"
else
  echo "==> WARNING: health check returned HTTP ${HTTP_STATUS}"
  echo "    Check logs: gcloud run services logs read ${SERVICE} --region ${REGION} --limit 30"
fi
