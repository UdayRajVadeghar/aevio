import { writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let initialized = false;

export function ensureGoogleCredentials(): void {
  if (initialized) return;

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initialized = true;
    return;
  }

  const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!rawJson) {
    throw new Error(
      "Missing Google credentials. Set GOOGLE_APPLICATION_CREDENTIALS locally or GOOGLE_SERVICE_ACCOUNT_JSON in production.",
    );
  }

  const filePath = join(tmpdir(), "gcp-service-account.json");
  writeFileSync(filePath, rawJson, { encoding: "utf8", mode: 0o600 });
  process.env.GOOGLE_APPLICATION_CREDENTIALS = filePath;
  initialized = true;
}
