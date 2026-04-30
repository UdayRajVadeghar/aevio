import { forwardToAdk } from "@/lib/adk-upstream";
import { coachContextToAdkPayload } from "@/lib/agent-coach-payload";
import { getTodayNutritionContext } from "@/lib/agent-today-context";
import { auth } from "@/lib/auth";
import { getOrBuildCoachContextForAdk } from "@/lib/coach-context";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type StreamRequestPayload = {
  message?: unknown;
  sessionId?: unknown;
  includeUserProfile?: unknown;
};

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  let payload: StreamRequestPayload;
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

  const includeUserProfile =
    payload.includeUserProfile === false ? false : true;

  const [row, userProfile] = await Promise.all([
    getOrBuildCoachContextForAdk(userId),
    includeUserProfile
      ? db.userProfile.findUnique({
          where: { userId },
          select: {
            thirtyDayGoal: true,
            healthConditions: true,
            dietaryPreference: true,
            primaryGoal: true,
            activityLevel: true,
            height: true,
            weight: true,
            age: true,
            gender: true,
          },
        })
      : null,
  ]);
  const { historySummary, context } = coachContextToAdkPayload(row, userProfile);
  try {
    context.todayNutrition = await getTodayNutritionContext(userId);
  } catch (error) {
    console.error("Failed to load today nutrition context:", error);
  }

  const sessionId =
    typeof payload.sessionId === "string"
      ? payload.sessionId.trim()
      : undefined;

  let upstream: Response;
  try {
    upstream = await forwardToAdk("/chat/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user.id,
        message,
        sessionId: sessionId || undefined,
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

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "ADK stream failed" },
      { status: upstream.status || 502 },
    );
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
