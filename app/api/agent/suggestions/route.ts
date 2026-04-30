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

    if (remainingCalories !== null) {
      if (remainingCalories > 150) {
        suggestions.push(
          `I have ${Math.round(remainingCalories)} calories left. What should I eat?`,
        );
      } else if (remainingCalories < -100) {
        suggestions.push(
          `I'm ${Math.abs(Math.round(remainingCalories))} calories over. How should I adjust dinner?`,
        );
      }
    }

    if (today.totals.protein < 80) {
      suggestions.push(
        `I'm at ${Math.round(today.totals.protein)}g protein today. What should I add?`,
      );
    } else {
      suggestions.push("Suggest a balanced next meal");
    }
  } else {
    suggestions.push("Plan my meals for today");

    if (today.goalCalories) {
      suggestions.push(
        `Build a ${today.goalCalories} calorie day with enough protein`,
      );
    } else {
      suggestions.push("Suggest my first meal");
    }

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
    return NextResponse.json(
      { error: "Failed to load suggestions" },
      { status: 500 },
    );
  }
}
