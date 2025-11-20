"use client";

import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Book, Moon, Smile, Sun } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

// Schema - All optional but encouraged
const journalingSchema = z.object({
  style: z.string().optional(),
  timeOfDay: z.string().optional(),
  moodTracking: z.boolean(),
});

export function StepJournaling() {
  const { data, updateData, setStep } = useOnboardingStore();

  const [formData, setFormData] = useState({
    style: data.journaling.style || "",
    timeOfDay: data.journaling.timeOfDay || "",
    moodTracking: data.journaling.moodTracking || false,
  });

  const handleContinue = () => {
    // Validation is trivial as everything is optional, but keeping pattern
    const result = journalingSchema.safeParse(formData);
    if (result.success) {
      updateData("journaling", formData);
      setStep(4);
    }
  };

  const journalingStyles = [
    {
      id: "freestyle",
      label: "Freestyle",
      description: "Write whatever comes to mind",
    },
    {
      id: "gratitude",
      label: "Gratitude",
      description: "Focus on what you're thankful for",
    },
    {
      id: "guided",
      label: "Guided",
      description: "Follow prompts and questions",
    },
    {
      id: "bullet",
      label: "Bullet Journal",
      description: "Short, structured points",
    },
  ];

  const timeOptions = [
    { id: "morning", label: "Morning", icon: Sun, color: "text-yellow-500" },
    { id: "evening", label: "Evening", icon: Moon, color: "text-blue-500" },
    {
      id: "anytime",
      label: "No Preference",
      icon: Book,
      color: "text-gray-500",
    },
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
          Journaling Preferences
        </h2>
        <p className="text-lg text-muted-foreground">
          Customize how you want to capture your thoughts.
        </p>
      </div>

      <div className="space-y-8">
        {/* Journaling Style */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">
            Preferred Journaling Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {journalingStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setFormData({ ...formData, style: style.id })}
                className={cn(
                  "relative flex flex-col items-start p-6 rounded-2xl border transition-all duration-300 hover:shadow-md group",
                  formData.style === style.id
                    ? "border-green-400 bg-green-50 dark:bg-green-950/20 shadow-sm"
                    : "border-input bg-card hover:border-green-400/50 hover:bg-green-50/50 dark:hover:bg-green-950/20"
                )}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span
                    className={cn(
                      "font-semibold",
                      formData.style === style.id
                        ? "text-green-700 dark:text-green-400"
                        : "text-foreground"
                    )}
                  >
                    {style.label}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  {style.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Time of Day */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">
            Best Time to Journal
          </label>
          <div className="flex flex-wrap gap-3">
            {timeOptions.map((time) => {
              const Icon = time.icon;
              return (
                <button
                  key={time.id}
                  onClick={() =>
                    setFormData({ ...formData, timeOfDay: time.id })
                  }
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200",
                    formData.timeOfDay === time.id
                      ? "border-green-400 bg-green-50 dark:bg-green-950/20"
                      : "bg-card hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-400/50"
                  )}
                >
                  <Icon className={cn("w-4 h-4", time.color)} />
                  <span className="text-sm font-medium">{time.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mood Tracking Toggle */}
        <div className="flex items-center justify-between p-6 rounded-2xl border bg-card/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
              <Smile className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">Enable Mood Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Track your emotional well-being over time
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.moodTracking}
              onChange={(e) =>
                setFormData({ ...formData, moodTracking: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>
      </div>

      <div className="pt-8 flex justify-between">
        <button
          onClick={() => setStep(2)}
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
