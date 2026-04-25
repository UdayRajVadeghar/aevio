import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const DEFAULT_ADK_API_URL = "http://127.0.0.1:8010";
const ADK_API_URL = process.env.ADK_API_URL?.trim() || DEFAULT_ADK_API_URL;

type AgentRequestPayload = {
  message?: unknown;
  historySummary?: unknown;
  context?: unknown;
};

function normalizeHistorySummary(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, 12000);
}

function normalizeContext(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: AgentRequestPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";
  if (!message) {
    return NextResponse.json(
      { error: "Missing 'message' in body" },
      { status: 400 },
    );
  }

  const historySummary = normalizeHistorySummary(payload.historySummary);
  const context = normalizeContext(payload.context);

  let upstream: Response;
  try {
    upstream = await fetch(`${ADK_API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user.id,
        message,
        historySummary,
        context,
      }),
    });
  } catch (error) {
    console.error("Failed to reach ADK API:", error);
    return NextResponse.json(
      { error: "ADK service is unavailable" },
      { status: 502 },
    );
  }

  let upstreamBody: unknown;
  try {
    upstreamBody = await upstream.json();
  } catch {
    upstreamBody = null;
  }

  if (!upstream.ok) {
    const upstreamError =
      typeof upstreamBody === "object" &&
      upstreamBody &&
      "detail" in upstreamBody &&
      typeof (upstreamBody as { detail?: unknown }).detail === "string"
        ? (upstreamBody as { detail: string }).detail
        : "ADK chat request failed";

    return NextResponse.json(
      { error: upstreamError },
      { status: upstream.status || 502 },
    );
  }

  return NextResponse.json(upstreamBody, { status: 200 });
}
