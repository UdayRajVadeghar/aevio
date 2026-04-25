import type { CoachContext } from "@/lib/generated/prisma/client";

/**
 * Shapes a CoachContext row for the ADK /chat `context` field (JSON-serializable).
 */
export function coachContextToAdkPayload(row: CoachContext): {
  historySummary: string;
  context: Record<string, unknown>;
} {
  return {
    historySummary: row.historySummary,
    context: {
      windows: {
        threeMonths: row.threeMonthsContext,
        twoMonths: row.twoMonthsContext,
        oneMonth: row.oneMonthContext,
        twoWeeks: row.twoWeeksContext,
        oneWeek: row.oneWeekContext,
        today: row.todayContext,
      },
      source: row.source,
      version: row.version,
      updatedAt: row.updatedAt.toISOString(),
    },
  };
}
