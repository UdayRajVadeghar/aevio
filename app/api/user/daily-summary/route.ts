import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getIstDateKey,
  isValidIstDateKey,
  shiftIstDateKey,
} from "@/lib/ist-time";
import {
  extractFoodItems,
  getNutritionTotalsForDate,
  toRounded,
} from "@/lib/nutrition-metrics";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function parseNonNegativeInt(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return fallback;
  }

  return parsed;
}

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const searchParams = new URL(req.url).searchParams;
  const dateParam = searchParams.get("date")?.trim();
  const offset = parseNonNegativeInt(searchParams.get("offset"), 0);
  const rawLimit = parseNonNegativeInt(searchParams.get("limit"), 5);
  const limit = Math.min(rawLimit || 5, 25);
  const selectedDate = dateParam || getIstDateKey();

  if (!isValidIstDateKey(selectedDate)) {
    return NextResponse.json(
      { error: "Invalid date. Use YYYY-MM-DD format." },
      { status: 400 },
    );
  }

  const previousDate = shiftIstDateKey(selectedDate, -1);

  try {
    const [meals, totals, dailyTotal, previousDailyTotal] = await Promise.all([
      db.mealAnalysis.findMany({
        where: {
          userId,
          status: "COMPLETE",
          loggedDateIst: selectedDate,
        },
        select: {
          id: true,
          imageUrl: true,
          calories: true,
          protein: true,
          carbs: true,
          fat: true,
          foodItems: true,
          loggedAtIst: true,
          createdAt: true,
        },
        orderBy: [{ loggedAtIst: "desc" }, { createdAt: "desc" }],
        skip: offset,
        take: limit,
      }),
      getNutritionTotalsForDate(userId, selectedDate),
      db.dailyCalorieTotal.findUnique({
        where: {
          userId_dateKey: {
            userId,
            dateKey: selectedDate,
          },
        },
        select: {
          totalCalories: true,
          timezone: true,
        },
      }),
      db.dailyCalorieTotal.findUnique({
        where: {
          userId_dateKey: {
            userId,
            dateKey: previousDate,
          },
        },
        select: {
          totalCalories: true,
        },
      }),
    ]);

    const totalCalories = dailyTotal?.totalCalories ?? totals.totalCalories;
    const previousCalories = previousDailyTotal?.totalCalories ?? 0;
    const nextOffset = offset + meals.length;
    const hasMore = nextOffset < totals.mealCount;

    return NextResponse.json({
      selectedDate,
      timezone: dailyTotal?.timezone ?? "Asia/Kolkata",
      summary: {
        mealCount: totals.mealCount,
        totalCalories: toRounded(totalCalories),
        recordedCalories: toRounded(dailyTotal?.totalCalories ?? 0),
        totalProtein: toRounded(totals.totalProtein),
        totalCarbs: toRounded(totals.totalCarbs),
        totalFat: toRounded(totals.totalFat),
      },
      comparison: {
        previousDate,
        previousCalories: toRounded(previousCalories),
        calorieDelta: toRounded(totalCalories - previousCalories),
      },
      meals: meals.map((meal) => ({
        id: meal.id,
        imageUrl: meal.imageUrl,
        calories: toRounded(meal.calories ?? 0),
        protein: toRounded(meal.protein ?? 0),
        carbs: toRounded(meal.carbs ?? 0),
        fat: toRounded(meal.fat ?? 0),
        loggedAtIst: meal.loggedAtIst,
        foodItems: extractFoodItems(meal.foodItems),
      })),
      pagination: {
        limit,
        offset,
        hasMore,
        nextOffset: hasMore ? nextOffset : null,
      },
    });
  } catch (error) {
    console.error("Error fetching daily summary:", error);
    return NextResponse.json(
      { error: "Failed to load daily summary" },
      { status: 500 },
    );
  }
}
