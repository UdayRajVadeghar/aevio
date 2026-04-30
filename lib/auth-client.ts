import { createAuthClient } from "better-auth/react";

function resolveAuthBaseUrl() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!configuredUrl) {
    return undefined;
  }

  return configuredUrl.replace(/\/+$/, "");
}

const authBaseUrl = resolveAuthBaseUrl();

export const authClient = createAuthClient(
  authBaseUrl ? { baseURL: authBaseUrl } : {},
);

export const { signIn, signUp, signOut, useSession } = authClient;
