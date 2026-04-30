import { coachContextToAdkPayload } from "@/lib/agent-coach-payload";
import { getTodayNutritionContext } from "@/lib/agent-today-context";
import { auth } from "@/lib/auth";
import { getOrBuildCoachContextForAdk } from "@/lib/coach-context";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [row, userProfile, todayNutrition] = await Promise.all([
    getOrBuildCoachContextForAdk(userId),
    db.userProfile.findUnique({
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
    }),
    getTodayNutritionContext(userId).catch((error) => {
      console.error("Failed to load today nutrition context:", error);
      return null;
    }),
  ]);

  const { historySummary, context } = coachContextToAdkPayload(
    row,
    userProfile,
  );
  if (todayNutrition) {
    context.todayNutrition = todayNutrition;
  }

  return NextResponse.json({
    historySummary,
    context,
  });
}
