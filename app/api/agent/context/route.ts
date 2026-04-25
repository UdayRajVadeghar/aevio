import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/** Read-only: current coach context row for the signed-in user (for agent UI / debugging). */
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
