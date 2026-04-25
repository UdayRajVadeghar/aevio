import { auth } from "@/lib/auth";
import {
  parseRefreshMode,
  parseWindowDays,
  refreshCoachContext,
} from "@/lib/coach-context";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

//gets the coach context for the user
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const coachContext = await db.coachContext.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json(
      {
        coachContext,
        exists: Boolean(coachContext),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to fetch coach context:", error);
    return NextResponse.json(
      { error: "Failed to fetch coach context" },
      { status: 500 },
    );
  }
}

//saves the coach context for the user
export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const searchParams = new URL(req.url).searchParams;
  const mode = parseRefreshMode(searchParams);
  const windowDays = parseWindowDays(searchParams);

  try {
    const result = await refreshCoachContext(userId, {
      mode,
      windowDaysForSummary: windowDays,
      sourcePrefix: "nextjs",
    });

    return NextResponse.json(
      {
        ok: true,
        mode: result.mode,
        coachContext: result.coachContext,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to rebuild coach context:", error);
    return NextResponse.json(
      { error: "Failed to rebuild coach context" },
      { status: 500 },
    );
  }
}
