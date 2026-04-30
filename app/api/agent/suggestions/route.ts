import { getTodayNutritionContext } from "@/lib/agent-today-context";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function buildSuggestions(today: Awaited<ReturnType<typeof getTodayNutritionContext>>) {
  const suggestions: string[] = [];
  const remainingCalories = today.remaining.calories;

  if (today.totals.mealCount > 0) {
    suggestions.push("Review my meals today");

    if (remainingCalories !== null && remainingCalories > 150) {
      suggestions.push("What should I eat with my remaining calories?");
    } else if (remainingCalories !== null && remainingCalories < -100) {
      suggestions.push("I'm over my calorie goal. How should I adjust?");
    } else {
      suggestions.push("Suggest a balanced next meal");
    }

    if (today.totals.protein < 80) {
      suggestions.push("How can I get more protein today?");
    } else {
      suggestions.push("What should I prioritize today?");
    }
  } else {
    suggestions.push("Plan my meals for today");
    suggestions.push("Suggest my first meal");
    suggestions.push("What should I prioritize today?");
  }

  return suggestions.slice(0, 3);
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const todayNutrition = await getTodayNutritionContext(session.user.id);

    return NextResponse.json({
      suggestions: buildSuggestions(todayNutrition),
      todayNutrition,
    });
  } catch (error) {
    console.error("Failed to build agent suggestions:", error);
    return NextResponse.json({
      suggestions: [
        "Plan my meals for today",
        "Suggest my first meal",
        "What should I prioritize today?",
      ],
      todayNutrition: null,
    });
  }
}
