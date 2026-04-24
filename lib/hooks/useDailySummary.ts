import { useInfiniteQuery } from "@tanstack/react-query";

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
  pagination: {
    limit: number;
    offset: number;
    hasMore: boolean;
    nextOffset: number | null;
  };
};

type ApiError = {
  error?: string;
};

const DEFAULT_MEALS_PAGE_SIZE = 5;

type FetchDailySummaryOptions = {
  dateKey: string;
  offset: number;
  limit: number;
};

async function fetchDailySummary({
  dateKey,
  offset,
  limit,
}: FetchDailySummaryOptions): Promise<DailySummaryData> {
  const response = await fetch(
    `/api/user/daily-summary?date=${encodeURIComponent(dateKey)}&offset=${offset}&limit=${limit}`,
  );

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiError;
    throw new Error(body.error ?? "Failed to fetch daily summary");
  }

  return (await response.json()) as DailySummaryData;
}

export function useDailySummary(dateKey: string, pageSize = DEFAULT_MEALS_PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: ["daily-summary", dateKey, pageSize],
    queryFn: ({ pageParam }) =>
      fetchDailySummary({
        dateKey,
        offset: pageParam,
        limit: pageSize,
      }),
    enabled: Boolean(dateKey),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasMore ? lastPage.pagination.nextOffset : undefined,
    staleTime: 60 * 1000,
  });
}
