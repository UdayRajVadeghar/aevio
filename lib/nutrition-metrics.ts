import { db } from "@/lib/db";

export type FoodItem = {
  name: string;
  quantity: number;
  portion: string;
  caloriesPerUnit: number;
  calories: number;
};

export type NutritionAverages = {
  mealsTracked: number;
  avgCaloriesPerMeal: number;
  avgProteinPerMeal: number;
  avgCarbsPerMeal: number;
  avgFatPerMeal: number;
};

export type NutritionTotals = {
  mealCount: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
};

export function toRounded(value: number): number {
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

export function extractFoodItems(value: unknown): FoodItem[] {
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

export async function getNutritionAveragesForWindow(
  userId: string,
  windowStart: Date,
): Promise<NutritionAverages> {
  const [mealAgg, mealsTracked] = await db.$transaction([
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
  ]);

  return {
    mealsTracked,
    avgCaloriesPerMeal: toRounded(Number(mealAgg._avg.calories ?? 0)),
    avgProteinPerMeal: toRounded(Number(mealAgg._avg.protein ?? 0)),
    avgCarbsPerMeal: toRounded(Number(mealAgg._avg.carbs ?? 0)),
    avgFatPerMeal: toRounded(Number(mealAgg._avg.fat ?? 0)),
  };
}

export async function getNutritionTotalsForDate(
  userId: string,
  selectedDate: string,
): Promise<NutritionTotals> {
  const [mealTotals, mealCount] = await db.$transaction([
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
  ]);

  return {
    mealCount,
    totalCalories: Number(mealTotals._sum.calories ?? 0),
    totalProtein: Number(mealTotals._sum.protein ?? 0),
    totalCarbs: Number(mealTotals._sum.carbs ?? 0),
    totalFat: Number(mealTotals._sum.fat ?? 0),
  };
}
