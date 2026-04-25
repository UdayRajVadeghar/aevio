/**
 * Minimal UserProfile fields forwarded to the ADK so prompts stay small and useful.
 * Omit empty values so the model only sees data that exists.
 */
export type UserProfileAdkFields = {
  thirtyDayGoal: string | null;
  healthConditions: string[];
  dietaryPreference: string | null;
  primaryGoal: string | null;
  activityLevel: string | null;
  height: number | null;
  weight: number | null;
  age: number | null;
  gender: string | null;
};

export function buildUserProfileForAdk(
  profile: UserProfileAdkFields | null | undefined,
): Record<string, unknown> | null {
  if (!profile) {
    return null;
  }

  const out: Record<string, unknown> = {};
  const g = (v: string | null | undefined) => v?.trim() ?? "";

  if (g(profile.thirtyDayGoal)) {
    out.thirtyDayGoal = g(profile.thirtyDayGoal);
  }
  if (profile.healthConditions?.length) {
    out.healthConditions = [...profile.healthConditions];
  }
  if (g(profile.dietaryPreference)) {
    out.dietaryPreference = g(profile.dietaryPreference);
  }
  if (g(profile.primaryGoal)) {
    out.primaryGoal = g(profile.primaryGoal);
  }
  if (g(profile.activityLevel)) {
    out.activityLevel = g(profile.activityLevel);
  }
  if (typeof profile.height === "number" && Number.isFinite(profile.height)) {
    out.height = profile.height;
  }
  if (typeof profile.weight === "number" && Number.isFinite(profile.weight)) {
    out.weight = profile.weight;
  }
  if (typeof profile.age === "number" && Number.isFinite(profile.age)) {
    out.age = profile.age;
  }
  if (g(profile.gender)) {
    out.gender = g(profile.gender);
  }

  return Object.keys(out).length > 0 ? out : null;
}
