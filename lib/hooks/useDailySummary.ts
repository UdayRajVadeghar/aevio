import { useQuery } from "@tanstack/react-query";

export type DailySummaryFoodItem = {
  name: string;
  quantity: number;
  portion: string;
  caloriesPerUnit: number;
  calories: number;
};

export type DailySummaryMeal = {
  id: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  loggedAtIst: string | null;
  foodItems: DailySummaryFoodItem[];
};

export type DailySummaryData = {
  selectedDate: string;
  timezone: string;
  summary: {
    mealCount: number;
    totalCalories: number;
    recordedCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  };
  comparison: {
    previousDate: string;
    previousCalories: number;
    calorieDelta: number;
  };
  meals: DailySummaryMeal[];
};

type ApiError = {
  error?: string;
};

async function fetchDailySummary(dateKey: string): Promise<DailySummaryData> {
  const response = await fetch(
    `/api/user/daily-summary?date=${encodeURIComponent(dateKey)}`,
  );

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiError;
    throw new Error(body.error ?? "Failed to fetch daily summary");
  }

  return (await response.json()) as DailySummaryData;
}

export function useDailySummary(dateKey: string) {
  return useQuery({
    queryKey: ["daily-summary", dateKey],
    queryFn: () => fetchDailySummary(dateKey),
    enabled: Boolean(dateKey),
    staleTime: 60 * 1000,
  });
}
