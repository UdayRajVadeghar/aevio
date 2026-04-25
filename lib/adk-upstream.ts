/**
 * Upstream Aevio ADK (FastAPI) — see services/adk-api.
 * Used by /api/adk/* proxy routes; keep a single place for the base URL.
 */
const DEFAULT_ADK_API_URL = "http://127.0.0.1:8010";

export function getAdkApiBaseUrl(): string {
  return (process.env.ADK_API_URL?.trim() || DEFAULT_ADK_API_URL).replace(
    /\/$/,
    "",
  );
}

/**
 * Forwards a request to the FastAPI app, path must start with `/` (e.g. `/health`, `/chat`).
 */
export async function forwardToAdk(
  path: `/${string}`,
  init?: RequestInit,
): Promise<Response> {
  const base = getAdkApiBaseUrl();
  return fetch(`${base}${path}`, init);
}
