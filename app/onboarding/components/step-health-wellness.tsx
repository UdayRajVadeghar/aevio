"use client";

import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Ruler,
  Target,
  Utensils,
  Weight,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const healthWellnessSchema = z.object({
  height: z
    .number()
    .min(120, "Height must be between 120 and 220 cm")
    .max(220, "Height must be between 120 and 220 cm"),
  weight: z
    .number()
    .min(30, "Weight must be between 30 and 200 kg")
    .max(200, "Weight must be between 30 and 200 kg"),
  activityLevel: z.string().min(1, "Please select an activity level"),
  primaryGoal: z.string().min(1, "Please select a primary goal"),
  dietaryPreference: z.string().optional(),
});

export function StepHealthWellness() {
  const { data, updateData, setStep } = useOnboardingStore();

  const [formData, setFormData] = useState({
    height: data.healthWellness.height || 170,
    weight: data.healthWellness.weight || 70,
    activityLevel: data.healthWellness.activityLevel || "",
    primaryGoal: data.healthWellness.primaryGoal || "",
    dietaryPreference: data.healthWellness.dietaryPreference || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContinue = () => {
    const result = healthWellnessSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    updateData("healthWellness", formData);
    setStep(3);
  };

  const activityLevels = [
    {
      id: "sedentary",
      label: "Sedentary",
      description: "Little to no exercise",
    },
    {
      id: "light",
      label: "Lightly Active",
      description: "Light exercise 1-3 days/week",
    },
    {
      id: "moderate",
      label: "Moderately Active",
      description: "Moderate exercise 3-5 days/week",
    },
    {
      id: "active",
      label: "Very Active",
      description: "Hard exercise 6-7 days/week",
    },
    {
      id: "athlete",
      label: "Extra Active",
      description: "Very hard exercise & physical job",
    },
  ];

  const goals = [
    { id: "lose_weight", label: "Lose Weight" },
    { id: "gain_muscle", label: "Gain Muscle" },
    { id: "maintain", label: "Maintain Weight" },
    { id: "improve_stamina", label: "Improve Stamina" },
    { id: "reduce_stress", label: "Reduce Stress" },
    { id: "better_sleep", label: "Better Sleep" },
  ];

  const dietaryPreferences = [
    { id: "no_preference", label: "No Preference" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" },
    { id: "keto", label: "Keto" },
    { id: "paleo", label: "Paleo" },
    { id: "gluten_free", label: "Gluten Free" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          Health & Wellness
        </h2>
        <p className="text-lg text-muted-foreground">
          Help us understand your physical profile and goals.
        </p>
      </div>

      <div className="space-y-8">
        {/* Height & Weight Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3 p-6 rounded-2xl border bg-card/50">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium flex items-center gap-2">
                <Ruler className="w-4 h-4 text-blue-500" /> Height
              </label>
              <span className="text-2xl font-bold text-primary">
                {formData.height}{" "}
                <span className="text-sm text-muted-foreground font-normal">
                  cm
                </span>
              </span>
            </div>
            <input
              type="range"
              min="120"
              max="220"
              value={formData.height}
              onChange={(e) =>
                setFormData({ ...formData, height: Number(e.target.value) })
              }
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-500/50 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:transition-all"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>120 cm</span>
              <span>220 cm</span>
            </div>
            {errors.height && (
              <p className="text-xs text-destructive">{errors.height}</p>
            )}
          </div>

          <div className="space-y-3 p-6 rounded-2xl border bg-card/50">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium flex items-center gap-2">
                <Weight className="w-4 h-4 text-red-500" /> Weight
              </label>
              <span className="text-2xl font-bold text-primary">
                {formData.weight}{" "}
                <span className="text-sm text-muted-foreground font-normal">
                  kg
                </span>
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="200"
              value={formData.weight}
              onChange={(e) =>
                setFormData({ ...formData, weight: Number(e.target.value) })
              }
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-red-500/50 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-red-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:transition-all"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>30 kg</span>
              <span>200 kg</span>
            </div>
            {errors.weight && (
              <p className="text-xs text-destructive">{errors.weight}</p>
            )}
          </div>
        </div>

        {/* Activity Level */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500" /> Activity Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activityLevels.map((level) => (
              <button
                key={level.id}
                onClick={() =>
                  setFormData({ ...formData, activityLevel: level.id })
                }
                className={cn(
                  "relative flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 hover:border-green-400/50 hover:bg-green-50/50 dark:hover:bg-green-950/20",
                  formData.activityLevel === level.id
                    ? "border-green-400 bg-green-50 dark:bg-green-950/20 ring-1 ring-green-400"
                    : "bg-card"
                )}
              >
                <span
                  className={cn(
                    "font-medium text-sm",
                    formData.activityLevel === level.id
                      ? "text-green-700 dark:text-green-400"
                      : ""
                  )}
                >
                  {level.label}
                </span>
                <span
                  className={cn(
                    "text-xs mt-1",
                    formData.activityLevel === level.id
                      ? "text-green-600 dark:text-green-500"
                      : "text-muted-foreground"
                  )}
                >
                  {level.description}
                </span>
                {formData.activityLevel === level.id && (
                  <div className="absolute top-2 right-2 text-green-500"></div>
                )}
              </button>
            ))}
          </div>
          {errors.activityLevel && (
            <p className="text-sm text-destructive">{errors.activityLevel}</p>
          )}
        </div>

        {/* Primary Goal */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Target className="w-4 h-4 text-red-500" /> Primary Goal
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() =>
                  setFormData({ ...formData, primaryGoal: goal.id })
                }
                className={cn(
                  "relative flex items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 hover:border-green-400/50 hover:bg-green-50/50 dark:hover:bg-green-950/20",
                  formData.primaryGoal === goal.id
                    ? "border-green-400 bg-green-50 dark:bg-green-950/20 ring-1 ring-green-400 text-green-700 dark:text-green-400"
                    : "bg-card"
                )}
              >
                <span className="text-sm">{goal.label}</span>
              </button>
            ))}
          </div>
          {errors.primaryGoal && (
            <p className="text-sm text-destructive">{errors.primaryGoal}</p>
          )}
        </div>

        {/* Dietary Preference */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Utensils className="w-4 h-4 text-slate-500" /> Dietary Preference
            (Optional)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {dietaryPreferences.map((diet) => (
              <button
                key={diet.id}
                onClick={() =>
                  setFormData({ ...formData, dietaryPreference: diet.id })
                }
                className={cn(
                  "px-3 py-2 rounded-full border text-xs transition-all duration-200 hover:border-green-400/50 hover:bg-green-50/50 dark:hover:bg-green-950/20",
                  formData.dietaryPreference === diet.id
                    ? "border-green-400 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                    : "bg-card"
                )}
              >
                {diet.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-between">
        <button
          onClick={() => setStep(1)}
          className="px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-base font-medium text-white shadow-xl shadow-blue-600/25 transition-all hover:shadow-2xl hover:shadow-blue-600/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
