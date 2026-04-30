import { auth } from "@/lib/auth";
import { refreshCoachContext } from "@/lib/coach-context";
import { db } from "@/lib/db";
import { getCurrentIstTime } from "@/lib/ist-time";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FOOD_NAME_LENGTH = 120;

type LogMealPayload = {
  name?: unknown;
  calories?: unknown;
  protein?: unknown;
  carbs?: unknown;
  fat?: unknown;
};

function parseMacro(value: unknown, field: string): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim()
        ? Number(value)
        : 0;

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${field} must be a non-negative number`);
  }

  return Math.round(parsed * 10) / 10;
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: LogMealPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Missing meal name" }, { status: 400 });
  }
  if (name.length > MAX_FOOD_NAME_LENGTH) {
    return NextResponse.json(
      { error: `Meal name must be ${MAX_FOOD_NAME_LENGTH} characters or less` },
      { status: 400 },
    );
  }

  let calories: number;
  let protein: number;
  let carbs: number;
  let fat: number;
  try {
    calories = parseMacro(payload.calories, "calories");
    protein = parseMacro(payload.protein, "protein");
    carbs = parseMacro(payload.carbs, "carbs");
    fat = parseMacro(payload.fat, "fat");
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid meal data" },
      { status: 400 },
    );
  }

  if (calories <= 0) {
    return NextResponse.json(
      { error: "Calories must be greater than zero" },
      { status: 400 },
    );
  }

  const istNow = await getCurrentIstTime();
  const userId = session.user.id;

  const [meal, dailyCalories] = await db.$transaction([
    db.mealAnalysis.create({
      data: {
        userId,
        imageUrl: "manual://agent-chat",
        gcsUri: "manual://agent-chat",
        status: "COMPLETE",
        calories,
        protein,
        carbs,
        fat,
        foodItems: {
          referenceObject: "manual",
          items: [
            {
              name,
              quantity: 1,
              portion: "manual entry",
              caloriesPerUnit: calories,
              calories,
            },
          ],
        },
        loggedAtIst: istNow.loggedAtIst,
        loggedDateIst: istNow.loggedDateIst,
        loggedTimezone: istNow.loggedTimezone,
      },
    }),
    db.dailyCalorieTotal.upsert({
      where: {
        userId_dateKey: {
          userId,
          dateKey: istNow.loggedDateIst,
        },
      },
      update: {
        totalCalories: {
          increment: calories,
        },
        timezone: istNow.loggedTimezone,
      },
      create: {
        userId,
        dateKey: istNow.loggedDateIst,
        timezone: istNow.loggedTimezone,
        totalCalories: calories,
      },
      select: {
        totalCalories: true,
        dateKey: true,
        timezone: true,
      },
    }),
  ]);

  try {
    await refreshCoachContext(userId, {
      mode: "incremental",
      sourcePrefix: "agent-action",
    });
  } catch (error) {
    console.error("Coach context refresh failed after manual meal log:", error);
  }

  return NextResponse.json({
    mealId: meal.id,
    loggedDateIst: dailyCalories.dateKey,
    loggedTimezone: dailyCalories.timezone,
    todayCaloriesTotal: dailyCalories.totalCalories,
  });
}
