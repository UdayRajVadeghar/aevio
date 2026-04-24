import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getIstDateKey, isValidIstDateKey, shiftIstDateKey } from "@/lib/ist-time";
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

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const dateParam = new URL(req.url).searchParams.get("date")?.trim();
  const selectedDate = dateParam || getIstDateKey();

  if (!isValidIstDateKey(selectedDate)) {
    return NextResponse.json(
      { error: "Invalid date. Use YYYY-MM-DD format." },
      { status: 400 },
    );
  }

  const previousDate = shiftIstDateKey(selectedDate, -1);

  try {
    const [meals, dailyTotal, previousDailyTotal] = await db.$transaction([
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

    const totals = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.calories ?? 0),
        protein: acc.protein + (meal.protein ?? 0),
        carbs: acc.carbs + (meal.carbs ?? 0),
        fat: acc.fat + (meal.fat ?? 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    );

    const totalCalories = dailyTotal?.totalCalories ?? totals.calories;
    const previousCalories = previousDailyTotal?.totalCalories ?? 0;

    return NextResponse.json({
      selectedDate,
      timezone: dailyTotal?.timezone ?? "Asia/Kolkata",
      summary: {
        mealCount: meals.length,
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
    });
  } catch (error) {
    console.error("Error fetching daily summary:", error);
    return NextResponse.json(
      { error: "Failed to load daily summary" },
      { status: 500 },
    );
  }
}
