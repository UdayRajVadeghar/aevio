import { forwardToAdk } from "@/lib/adk-upstream";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type EstimateCaloriesPayload = {
  profile?: unknown;
};

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: EstimateCaloriesPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    !payload.profile ||
    typeof payload.profile !== "object" ||
    Array.isArray(payload.profile)
  ) {
    return NextResponse.json({ error: "Missing profile" }, { status: 400 });
  }

  try {
    const upstream = await forwardToAdk("/estimate-calories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user.id,
        profile: payload.profile,
      }),
    });

    const body = await upstream.json().catch(() => null);
    return NextResponse.json(body, { status: upstream.status });
  } catch (error) {
    console.error("Failed to reach ADK calorie estimator:", error);
    return NextResponse.json(
      { error: "ADK service is unavailable" },
      { status: 502 },
    );
  }
}
