import type { CoachContext } from "@/lib/generated/prisma/client";
import {
  buildUserProfileForAdk,
  type UserProfileAdkFields,
} from "@/lib/user-profile-adk-slice";

/**
 * Shapes a CoachContext row for the ADK /chat `context` field (JSON-serializable).
 * When `userProfile` is present and has at least one selected field, includes
 * `context.userProfile` alongside nutrition windows (trusted app data).
 */
export function coachContextToAdkPayload(
  row: CoachContext,
  userProfile?: UserProfileAdkFields | null,
): {
  historySummary: string;
  context: Record<string, unknown>;
} {
  const context: Record<string, unknown> = {
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
  };

  const profileSlice = buildUserProfileForAdk(userProfile ?? null);
  if (profileSlice) {
    context.userProfile = profileSlice;
  }

  return {
    historySummary: row.historySummary,
    context,
  };
}
