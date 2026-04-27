"use client";

import { authClient } from "@/lib/auth-client";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const goalSchema = z.object({
  goal: z.string().max(200, "Goal must be less than 200 characters").optional(),
  caloriesIntake: z
    .number()
    .int("Calories intake must be a whole number")
    .min(500, "Calories intake must be between 500 and 10000")
    .max(10000, "Calories intake must be between 500 and 10000")
    .optional(),
  calorieGoalEndDate: z.coerce.date().optional(),
});

export function StepFinal() {
  const { data, updateData, completeOnboarding } = useOnboardingStore();
  const router = useRouter();
  const userId = authClient.useSession().data?.user?.id;

  const [goal, setGoal] = useState(data.goal || "");
  const [caloriesIntake, setCaloriesIntake] = useState(
    data.caloriesIntake !== null && data.caloriesIntake !== undefined
      ? String(data.caloriesIntake)
      : "",
  );
  const [calorieGoalEndDate, setCalorieGoalEndDate] = useState(
    data.calorieGoalEndDate
      ? new Date(data.calorieGoalEndDate).toISOString().split("T")[0]
      : "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async () => {
    const parsedCaloriesIntake = caloriesIntake.trim()
      ? Number(caloriesIntake)
      : undefined;
    const result = goalSchema.safeParse({
      goal,
      caloriesIntake: parsedCaloriesIntake,
      calorieGoalEndDate: calorieGoalEndDate || undefined,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    if (!userId) {
      setError("User not authenticated");
      return;
    }

    setIsSubmitting(true);
    updateData("goal", goal);
    updateData("caloriesIntake", result.data.caloriesIntake ?? null);
    updateData(
      "calorieGoalEndDate",
      result.data.calorieGoalEndDate ?? undefined,
    );

    try {
      await completeOnboarding(userId);
      router.push("/"); // Redirect to home after completion
    } catch (error) {
      console.error("Failed to complete onboarding", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to complete onboarding",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full space-y-8"
    >
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Final Step</span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          Your Goals
        </h2>
        <p className="text-lg text-muted-foreground">
          Tell us your general goals so we can personalize your experience.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="caloriesIntake" className="block text-sm font-medium">
            Daily calories intake target{" "}
            <span className="text-muted-foreground font-normal">
              (Optional)
            </span>
          </label>
          <input
            id="caloriesIntake"
            type="number"
            min={500}
            max={10000}
            step={1}
            value={caloriesIntake}
            onChange={(e) => {
              setCaloriesIntake(e.target.value);
              setError(null);
            }}
            className={cn(
              "flex h-11 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:bg-accent/20 hover:border-primary/30",
              error && "border-destructive focus-visible:ring-destructive",
            )}
            placeholder="e.g. 2200"
          />
        </div>

        <div className="space-y-3">
          <label
            htmlFor="calorieGoalEndDate"
            className="block text-sm font-medium"
          >
            Follow this calories goal until{" "}
            <span className="text-muted-foreground font-normal">
              (Optional)
            </span>
          </label>
          <input
            id="calorieGoalEndDate"
            type="date"
            value={calorieGoalEndDate}
            onChange={(e) => {
              setCalorieGoalEndDate(e.target.value);
              setError(null);
            }}
            className={cn(
              "flex h-11 w-full rounded-xl border border-input bg-background/50 px-4 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:bg-accent/20 hover:border-primary/30",
              error && "border-destructive focus-visible:ring-destructive",
            )}
          />
        </div>

        <div className="space-y-3">
          <label htmlFor="goal" className="block text-sm font-medium">
            What goals are you working toward right now?{" "}
            <span className="text-muted-foreground font-normal">
              (Optional)
            </span>
          </label>
          <div className="relative">
            <textarea
              id="goal"
              value={goal}
              onChange={(e) => {
                if (e.target.value.length <= 200) {
                  setGoal(e.target.value);
                  setError(null);
                }
              }}
              rows={4}
              className={cn(
                "flex w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all duration-300 hover:bg-accent/20 hover:border-primary/30",
                error && "border-destructive focus-visible:ring-destructive",
              )}
              placeholder="e.g. Build consistency, improve sleep, and stay active most days."
            />
            <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
              {goal.length}/200
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <div className="bg-card/50 border rounded-xl p-4">
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">
            Examples:
          </h4>
          <ul className="text-sm space-y-1 text-muted-foreground/80 list-disc pl-4">
            <li>Feel more energetic and reduce stress</li>
            <li>Build healthy routines I can stick to</li>
            <li>Improve fitness and sleep quality</li>
          </ul>
        </div>
      </div>

      <div className="pt-8 flex justify-end">
        <button
          onClick={handleFinish}
          disabled={isSubmitting}
          className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-base font-medium text-white shadow-xl shadow-blue-600/25 transition-all hover:shadow-2xl hover:shadow-blue-600/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              Setting up...
            </span>
          ) : (
            <>
              Finish Setup
              <Check className="ml-2 h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
