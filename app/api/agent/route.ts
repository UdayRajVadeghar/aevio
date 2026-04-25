import { coachContextToAdkPayload } from "@/lib/agent-coach-payload";
import { forwardToAdk } from "@/lib/adk-upstream";
import { auth } from "@/lib/auth";
import { getOrBuildCoachContextForAdk } from "@/lib/coach-context";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
/** First request may run a full coach-context refresh. */
export const maxDuration = 60;

type AgentRequestPayload = {
  message?: unknown;
};

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

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

  const row = await getOrBuildCoachContextForAdk(userId);
  const { historySummary, context } = coachContextToAdkPayload(row);

  let upstream: Response;
  try {
    upstream = await forwardToAdk("/chat", {
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
