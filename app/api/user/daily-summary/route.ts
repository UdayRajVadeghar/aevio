import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  getIstDateKey,
  isValidIstDateKey,
  shiftIstDateKey,
} from "@/lib/ist-time";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type FoodItem = {
  name: string;
  quantity: number;
  portion: string;
  caloriesPerUnit: number;
  calories: number;
};

function toRounded(value: number): number {
  return Number(value.toFixed(1));
}

function isValidFoodItem(value: unknown): value is FoodItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.name === "string" &&
    typeof item.quantity === "number" &&
    typeof item.portion === "string" &&
    typeof item.caloriesPerUnit === "number" &&
    typeof item.calories === "number"
  );
}

function extractFoodItems(value: unknown): FoodItem[] {
  if (!value || typeof value !== "object") {
    return [];
  }

  const record = value as Record<string, unknown>;
  const items = record.items;

  if (!Array.isArray(items)) {
    return [];
  }

  return items.filter(isValidFoodItem);
}

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
    const [meals, mealTotals, mealCount, dailyTotal, previousDailyTotal] =
      await db.$transaction([
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
        db.mealAnalysis.aggregate({
          where: {
            userId,
            status: "COMPLETE",
            loggedDateIst: selectedDate,
          },
          _sum: {
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
            loggedDateIst: selectedDate,
          },
        }),
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

    const totals = {
      calories: mealTotals._sum.calories ?? 0,
      protein: mealTotals._sum.protein ?? 0,
      carbs: mealTotals._sum.carbs ?? 0,
      fat: mealTotals._sum.fat ?? 0,
    };

    const totalCalories = dailyTotal?.totalCalories ?? totals.calories;
    const previousCalories = previousDailyTotal?.totalCalories ?? 0;
    const nextOffset = offset + meals.length;
    const hasMore = nextOffset < mealCount;

    return NextResponse.json({
      selectedDate,
      timezone: dailyTotal?.timezone ?? "Asia/Kolkata",
      summary: {
        mealCount,
        totalCalories: toRounded(totalCalories),
        recordedCalories: toRounded(dailyTotal?.totalCalories ?? 0),
        totalProtein: toRounded(totals.protein),
        totalCarbs: toRounded(totals.carbs),
        totalFat: toRounded(totals.fat),
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
