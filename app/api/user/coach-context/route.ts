import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_WINDOW_DAYS = 90;
const MAX_WINDOW_DAYS = 180;
const DEFAULT_MODE = "full";

type RefreshMode = "full" | "incremental";

function parseWindowDays(searchParams: URLSearchParams): number {
  const raw = searchParams.get("windowDays");
  if (!raw) {
    return DEFAULT_WINDOW_DAYS;
  }

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_WINDOW_DAYS;
  }

  return Math.min(parsed, MAX_WINDOW_DAYS);
}

function parseMode(searchParams: URLSearchParams): RefreshMode {
  const raw = searchParams.get("mode")?.trim().toLowerCase();
  if (raw === "incremental") {
    return "incremental";
  }
  return DEFAULT_MODE;
}

function buildHistorySummary(input: {
  windowDays: number;
  mealsTracked: number;
  workoutsTracked: number;
  avgCalories: number;
  avgProtein: number;
}): string {
  const { windowDays, mealsTracked, workoutsTracked, avgCalories, avgProtein } =
    input;

  return [
    `Summary window: last ${windowDays} days.`,
    `Meals tracked: ${mealsTracked}. Workouts logged: ${workoutsTracked}.`,
    `Average calories per logged meal: ${avgCalories.toFixed(1)}.`,
    `Average protein per logged meal: ${avgProtein.toFixed(1)}g.`,
    "Use this as high-level guidance, not a diagnosis.",
  ].join(" ");
}

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
  const mode = parseMode(searchParams);
  let resolvedMode: RefreshMode = mode;
  const windowDays = parseWindowDays(searchParams);
  const windowStart = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

  try {
    if (mode === "incremental") {
      const dayStart = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const [
        existingCoachContext,
        mealAggToday,
        mealsTrackedToday,
        workoutsToday,
      ] = await db.$transaction([
        db.coachContext.findUnique({
          where: { userId },
        }),
        db.mealAnalysis.aggregate({
          where: {
            userId,
            status: "COMPLETE",
            createdAt: { gte: dayStart },
          },
          _avg: {
            calories: true,
            protein: true,
            carbs: true,
            fat: true,
          },
        }),
        db.mealAnalysis.count({
          where: {
            userId,
            status: "COMPLETE",
            createdAt: { gte: dayStart },
          },
        }),
        db.workout.count({
          where: {
            userId,
            createdAt: { gte: dayStart },
          },
        }),
      ]);

      const existingContext =
        existingCoachContext &&
        existingCoachContext.context &&
        typeof existingCoachContext.context === "object"
          ? (existingCoachContext.context as Record<string, unknown>)
          : {};
      const hasFullWindowContext =
        Boolean(existingContext.window) &&
        typeof existingContext.window === "object";

      if (!existingCoachContext || !hasFullWindowContext) {
        resolvedMode = "full";
      } else {
        const incrementalContext = {
          ...existingContext,
          incremental: {
            dayStart: dayStart.toISOString(),
            mealsTrackedToday,
            workoutsToday,
            avgCaloriesPerMealToday: Number(
              Number(mealAggToday._avg.calories ?? 0).toFixed(1),
            ),
            avgProteinPerMealToday: Number(
              Number(mealAggToday._avg.protein ?? 0).toFixed(1),
            ),
            avgCarbsPerMealToday: Number(
              Number(mealAggToday._avg.carbs ?? 0).toFixed(1),
            ),
            avgFatPerMealToday: Number(
              Number(mealAggToday._avg.fat ?? 0).toFixed(1),
            ),
            updatedAt: new Date().toISOString(),
          },
          metadata: {
            ...(existingContext.metadata as
              | Record<string, unknown>
              | undefined),
            mode: "incremental",
            lastIncrementalAt: new Date().toISOString(),
          },
        };

        const fallbackSummary = buildHistorySummary({
          windowDays,
          mealsTracked: mealsTrackedToday,
          workoutsTracked: workoutsToday,
          avgCalories: Number(mealAggToday._avg.calories ?? 0),
          avgProtein: Number(mealAggToday._avg.protein ?? 0),
        });

        const coachContext = await db.coachContext.upsert({
          where: { userId },
          create: {
            userId,
            historySummary: fallbackSummary,
            context: incrementalContext,
            source: "nextjs-incremental-refresh",
            version: 1,
          },
          update: {
            historySummary:
              existingCoachContext.historySummary || fallbackSummary,
            context: incrementalContext,
            source: "nextjs-incremental-refresh",
            version: { increment: 1 },
          },
        });

        return NextResponse.json(
          {
            ok: true,
            mode: resolvedMode,
            coachContext,
          },
          { status: 200 },
        );
      }
    }

    const [mealAgg, mealsTracked, workoutsTracked] = await db.$transaction([
      db.mealAnalysis.aggregate({
        where: {
          userId,
          status: "COMPLETE",
          createdAt: { gte: windowStart },
        },
        _avg: {
          calories: true,
          protein: true,
          carbs: true,
          fat: true,
        },
      }),
      db.mealAnalysis.count({
        where: {
          userId,
          status: "COMPLETE",
          createdAt: { gte: windowStart },
        },
      }),
      db.workout.count({
        where: {
          userId,
          createdAt: { gte: windowStart },
        },
      }),
    ]);

    const avgCalories = Number(mealAgg._avg.calories ?? 0);
    const avgProtein = Number(mealAgg._avg.protein ?? 0);
    const avgCarbs = Number(mealAgg._avg.carbs ?? 0);
    const avgFat = Number(mealAgg._avg.fat ?? 0);

    const contextPayload = {
      window: {
        days: windowDays,
        startDate: windowStart.toISOString(),
        endDate: new Date().toISOString(),
      },
      nutrition: {
        mealsTracked,
        avgCaloriesPerMeal: Number(avgCalories.toFixed(1)),
        avgProteinPerMeal: Number(avgProtein.toFixed(1)),
        avgCarbsPerMeal: Number(avgCarbs.toFixed(1)),
        avgFatPerMeal: Number(avgFat.toFixed(1)),
      },
      training: {
        workoutsTracked,
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        version: 1,
      },
    };

    const historySummary = buildHistorySummary({
      windowDays,
      mealsTracked,
      workoutsTracked,
      avgCalories,
      avgProtein,
    });

    const coachContext = await db.coachContext.upsert({
      where: { userId },
      create: {
        userId,
        historySummary,
        context: contextPayload,
        source: "nextjs-full-refresh",
        version: 1,
      },
      update: {
        historySummary,
        context: contextPayload,
        source: "nextjs-full-refresh",
        version: { increment: 1 },
      },
    });

    return NextResponse.json(
      {
        ok: true,
        mode: resolvedMode,
        coachContext,
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
