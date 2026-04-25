import { db } from "@/lib/db";
import { getNutritionAveragesForWindow, toRounded } from "@/lib/nutrition-metrics";

const DEFAULT_WINDOW_DAYS = 90;
const MAX_WINDOW_DAYS = 180;
const DEFAULT_MODE = "full";

type RefreshMode = "full" | "incremental";

type WindowKey =
  | "threeMonthsContext"
  | "twoMonthsContext"
  | "oneMonthContext"
  | "twoWeeksContext"
  | "oneWeekContext"
  | "todayContext";

type WindowConfig = {
  key: WindowKey;
  days: number;
  label: string;
};

const WINDOW_CONFIGS: WindowConfig[] = [
  { key: "threeMonthsContext", days: 90, label: "last_3_months" },
  { key: "twoMonthsContext", days: 60, label: "last_2_months" },
  { key: "oneMonthContext", days: 30, label: "last_1_month" },
  { key: "twoWeeksContext", days: 14, label: "last_2_weeks" },
  { key: "oneWeekContext", days: 7, label: "last_1_week" },
  { key: "todayContext", days: 1, label: "last_24_hours" },
];

export function parseWindowDays(searchParams: URLSearchParams): number {
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

export function parseRefreshMode(searchParams: URLSearchParams): RefreshMode {
  const raw = searchParams.get("mode")?.trim().toLowerCase();
  if (raw === "incremental") {
    return "incremental";
  }
  return DEFAULT_MODE;
}

export function buildHistorySummary(input: {
  windowDays: number;
  mealsTracked: number;
  avgCalories: number;
  avgProtein: number;
}): string {
  const { windowDays, mealsTracked, avgCalories, avgProtein } = input;

  return [
    `Summary window: last ${windowDays} days.`,
    `Meals tracked: ${mealsTracked}.`,
    `Average calories per logged meal: ${toRounded(avgCalories).toFixed(1)}.`,
    `Average protein per logged meal: ${toRounded(avgProtein).toFixed(1)}g.`,
    "Use this as high-level guidance, not a diagnosis.",
  ].join(" ");
}

type CoachWindowPayload = {
  label: string;
  window: {
    days: number;
    startDate: string;
    endDate: string;
  };
  nutrition: {
    mealsTracked: number;
    avgCaloriesPerMeal: number;
    avgProteinPerMeal: number;
    avgCarbsPerMeal: number;
    avgFatPerMeal: number;
  };
  metadata: {
    generatedAt: string;
    mode: "full" | "incremental";
  };
};

async function buildWindowPayload(
  userId: string,
  config: WindowConfig,
  now: Date,
  mode: "full" | "incremental",
): Promise<CoachWindowPayload> {
  const windowStart = new Date(now.getTime() - config.days * 24 * 60 * 60 * 1000);
  const windowMetrics = await getNutritionAveragesForWindow(userId, windowStart);

  return {
    label: config.label,
    window: {
      days: config.days,
      startDate: windowStart.toISOString(),
      endDate: now.toISOString(),
    },
    nutrition: {
      mealsTracked: windowMetrics.mealsTracked,
      avgCaloriesPerMeal: windowMetrics.avgCaloriesPerMeal,
      avgProteinPerMeal: windowMetrics.avgProteinPerMeal,
      avgCarbsPerMeal: windowMetrics.avgCarbsPerMeal,
      avgFatPerMeal: windowMetrics.avgFatPerMeal,
    },
    metadata: {
      generatedAt: now.toISOString(),
      mode,
    },
  };
}

export async function refreshCoachContext(
  userId: string,
  options?: {
    mode?: RefreshMode;
    windowDaysForSummary?: number;
    sourcePrefix?: string;
  },
) {
  const requestedMode = options?.mode ?? DEFAULT_MODE;
  const now = new Date();
  const sourcePrefix = options?.sourcePrefix ?? "nextjs";
  const summaryWindowDays = options?.windowDaysForSummary ?? DEFAULT_WINDOW_DAYS;

  if (requestedMode === "incremental") {
    const existingCoachContext = await db.coachContext.findUnique({
      where: { userId },
    });

    if (existingCoachContext) {
      const todayContext = await buildWindowPayload(
        userId,
        WINDOW_CONFIGS[WINDOW_CONFIGS.length - 1],
        now,
        "incremental",
      );

      const coachContext = await db.coachContext.update({
        where: { userId },
        data: {
          todayContext,
          source: `${sourcePrefix}-incremental-refresh`,
          version: { increment: 1 },
        } as never,
      });

      return {
        mode: "incremental" as const,
        coachContext,
      };
    }
  }

  const windowPayloads = await Promise.all(
    WINDOW_CONFIGS.map(async (config) => ({
      key: config.key,
      payload: await buildWindowPayload(userId, config, now, "full"),
    })),
  );

  const payloadByKey = Object.fromEntries(
    windowPayloads.map((entry) => [entry.key, entry.payload]),
  ) as Record<WindowKey, CoachWindowPayload>;

  const summaryWindow = new Date(
    now.getTime() - summaryWindowDays * 24 * 60 * 60 * 1000,
  );
  const summaryMetrics = await getNutritionAveragesForWindow(userId, summaryWindow);
  const historySummary = buildHistorySummary({
    windowDays: summaryWindowDays,
    mealsTracked: summaryMetrics.mealsTracked,
    avgCalories: summaryMetrics.avgCaloriesPerMeal,
    avgProtein: summaryMetrics.avgProteinPerMeal,
  });

  const coachContext = await db.coachContext.upsert({
    where: { userId },
    create: {
      userId,
      historySummary,
      threeMonthsContext: payloadByKey.threeMonthsContext,
      twoMonthsContext: payloadByKey.twoMonthsContext,
      oneMonthContext: payloadByKey.oneMonthContext,
      twoWeeksContext: payloadByKey.twoWeeksContext,
      oneWeekContext: payloadByKey.oneWeekContext,
      todayContext: payloadByKey.todayContext,
      source: `${sourcePrefix}-full-refresh`,
      version: 1,
    } as never,
    update: {
      historySummary,
      threeMonthsContext: payloadByKey.threeMonthsContext,
      twoMonthsContext: payloadByKey.twoMonthsContext,
      oneMonthContext: payloadByKey.oneMonthContext,
      twoWeeksContext: payloadByKey.twoWeeksContext,
      oneWeekContext: payloadByKey.oneWeekContext,
      todayContext: payloadByKey.todayContext,
      source: `${sourcePrefix}-full-refresh`,
      version: { increment: 1 },
    } as never,
  });

  return {
    mode: "full" as const,
    coachContext,
  };
}
