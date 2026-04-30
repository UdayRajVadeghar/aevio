#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="aevio-479110"
REGION="asia-southeast1"
SERVICE="scheduler"
IMAGE="gcr.io/${PROJECT_ID}/${SERVICE}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Building container image"
gcloud builds submit --tag "${IMAGE}" "${SCRIPT_DIR}"

echo "==> Deploying to Cloud Run"
gcloud run deploy "${SERVICE}" \
  --image "${IMAGE}" \
  --region "${REGION}" \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 1 \
  --no-cpu-throttling \
  --set-env-vars PING_INTERVAL_SECONDS=300 \
  --allow-unauthenticated \
  --quiet

echo "==> Setting up Cloud Scheduler backup ping (every 5 min, 24/7)"
SERVICE_URL=$(gcloud run services describe "${SERVICE}" --region "${REGION}" --format="value(status.url)")

gcloud scheduler jobs delete aevio-keepalive --location="${REGION}" --quiet 2>/dev/null || true

gcloud scheduler jobs create http aevio-keepalive \
  --location "${REGION}" \
  --schedule "*/5 * * * *" \
  --uri "${SERVICE_URL}/ping" \
  --http-method GET \
  --attempt-deadline 60s

echo "==> Verifying health"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${SERVICE_URL}/health")

if [ "$HTTP_STATUS" = "200" ]; then
  echo "==> Deploy successful: ${SERVICE_URL}"
  echo "==> Internal keepalive loop runs every 5 min with Cloud Scheduler backup"
else
  echo "==> WARNING: health check returned HTTP ${HTTP_STATUS}"
  echo "    Check logs: gcloud run services logs read ${SERVICE} --region ${REGION} --limit 30"
fi
