"use client";

import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

const goalSchema = z.object({
  goal: z.string().max(200, "Goal must be less than 200 characters").optional(),
});

export function StepFinal() {
  const { data, updateData, completeOnboarding } = useOnboardingStore();
  const router = useRouter();

  const [goal, setGoal] = useState(data.goal || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async () => {
    const result = goalSchema.safeParse({ goal });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsSubmitting(true);
    updateData("goal", goal);

    try {
      await completeOnboarding();
      router.push("/dashboard"); // Redirect to dashboard after completion
    } catch (error) {
      console.error("Failed to complete onboarding", error);
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
          One Last Thing...
        </h2>
        <p className="text-lg text-muted-foreground">
          Set a specific intention for your first 30 days.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label htmlFor="goal" className="block text-sm font-medium">
            What is your main focus for the next 30 days?{" "}
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
                error && "border-destructive focus-visible:ring-destructive"
              )}
              placeholder="e.g. I want to drink water consistently and walk 5k steps daily."
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
            <li>Meditate for 5 minutes every morning</li>
            <li>Cut down sugar from my coffee</li>
            <li>Read 10 pages of a book before bed</li>
          </ul>
        </div>
      </div>

      <div className="pt-8 flex justify-end">
        <button
          onClick={handleFinish}
          disabled={isSubmitting}
          className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-base font-medium text-white shadow-xl shadow-blue-600/25 transition-all hover:shadow-2xl hover:shadow-blue-600/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
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
