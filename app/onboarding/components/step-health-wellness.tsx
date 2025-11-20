"use client";

import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Check,
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
          <div className="space-y-4 p-6 rounded-2xl border bg-card/50">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium flex items-center gap-2">
                <Ruler className="w-4 h-4 text-primary" /> Height
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
              className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>120 cm</span>
              <span>220 cm</span>
            </div>
            {errors.height && (
              <p className="text-xs text-destructive">{errors.height}</p>
            )}
          </div>

          <div className="space-y-4 p-6 rounded-2xl border bg-card/50">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium flex items-center gap-2">
                <Weight className="w-4 h-4 text-primary" /> Weight
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
              className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
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
        <div className="space-y-4">
          <label className="text-sm font-medium flex items-center gap-2">
            <Activity className="w-4 h-4" /> Activity Level
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activityLevels.map((level) => (
              <button
                key={level.id}
                onClick={() =>
                  setFormData({ ...formData, activityLevel: level.id })
                }
                className={cn(
                  "relative flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 hover:border-primary/50 hover:bg-accent/50",
                  formData.activityLevel === level.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "bg-card"
                )}
              >
                <span className="font-medium text-sm">{level.label}</span>
                <span className="text-xs text-muted-foreground mt-1">
                  {level.description}
                </span>
                {formData.activityLevel === level.id && (
                  <div className="absolute top-2 right-2 text-primary">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            ))}
          </div>
          {errors.activityLevel && (
            <p className="text-sm text-destructive">{errors.activityLevel}</p>
          )}
        </div>

        {/* Primary Goal */}
        <div className="space-y-4">
          <label className="text-sm font-medium flex items-center gap-2">
            <Target className="w-4 h-4" /> Primary Goal
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() =>
                  setFormData({ ...formData, primaryGoal: goal.id })
                }
                className={cn(
                  "relative flex items-center justify-center p-3 rounded-xl border text-center transition-all duration-200 hover:border-primary/50 hover:bg-accent/50",
                  formData.primaryGoal === goal.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary text-primary font-medium"
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
        <div className="space-y-4">
          <label className="text-sm font-medium flex items-center gap-2">
            <Utensils className="w-4 h-4" /> Dietary Preference (Optional)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {dietaryPreferences.map((diet) => (
              <button
                key={diet.id}
                onClick={() =>
                  setFormData({ ...formData, dietaryPreference: diet.id })
                }
                className={cn(
                  "px-3 py-2 rounded-full border text-xs transition-all duration-200 hover:border-primary/50 hover:bg-accent/50",
                  formData.dietaryPreference === diet.id
                    ? "border-primary bg-primary/10 text-primary"
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
          className="group relative inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-xl transition-all hover:bg-primary/90 hover:shadow-primary/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
