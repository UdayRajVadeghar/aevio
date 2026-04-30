import { getIstDateKey } from "@/lib/ist-time";
import { extractFoodItems, toRounded } from "@/lib/nutrition-metrics";
import { db } from "@/lib/db";

export type TodayNutritionContext = {
  dateKey: string;
  timezone: string;
  goalCalories: number | null;
  totals: {
    mealCount: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  remaining: {
    calories: number | null;
  };
  meals: {
    id: string;
    loggedAtIst: string | null;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    foods: string[];
  }[];
};

export async function getTodayNutritionContext(
  userId: string,
): Promise<TodayNutritionContext> {
  const dateKey = getIstDateKey();

  const [meals, mealTotals, mealCount, dailyTotal, profile] = await Promise.all([
    db.mealAnalysis.findMany({
      where: {
        userId,
        status: "COMPLETE",
        loggedDateIst: dateKey,
      },
      select: {
        id: true,
        calories: true,
        protein: true,
        carbs: true,
        fat: true,
        foodItems: true,
        loggedAtIst: true,
      },
      orderBy: [{ loggedAtIst: "asc" }, { createdAt: "asc" }],
      take: 20,
    }),
    db.mealAnalysis.aggregate({
      where: {
        userId,
        status: "COMPLETE",
        loggedDateIst: dateKey,
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
        loggedDateIst: dateKey,
      },
    }),
    db.dailyCalorieTotal.findUnique({
      where: {
        userId_dateKey: {
          userId,
          dateKey,
        },
      },
      select: {
        totalCalories: true,
        timezone: true,
      },
    }),
    db.userProfile.findUnique({
      where: { userId },
      select: {
        dailyCalorieIntakeGoal: true,
      },
    }),
  ]);

  const goalCalories = profile?.dailyCalorieIntakeGoal ?? null;
  const calories = toRounded(
    dailyTotal?.totalCalories ?? Number(mealTotals._sum.calories ?? 0),
  );

  return {
    dateKey,
    timezone: dailyTotal?.timezone ?? "Asia/Kolkata",
    goalCalories,
    totals: {
      mealCount,
      calories,
      protein: toRounded(Number(mealTotals._sum.protein ?? 0)),
      carbs: toRounded(Number(mealTotals._sum.carbs ?? 0)),
      fat: toRounded(Number(mealTotals._sum.fat ?? 0)),
    },
    remaining: {
      calories:
        goalCalories === null ? null : toRounded(goalCalories - calories),
    },
    meals: meals.map((meal) => ({
      id: meal.id,
      loggedAtIst: meal.loggedAtIst?.toISOString() ?? null,
      calories: toRounded(meal.calories ?? 0),
      protein: toRounded(meal.protein ?? 0),
      carbs: toRounded(meal.carbs ?? 0),
      fat: toRounded(meal.fat ?? 0),
      foods: extractFoodItems(meal.foodItems).map((item) => item.name),
    })),
  };
}
