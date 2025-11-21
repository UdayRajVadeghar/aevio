"use client";

import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Ban,
  BookOpen,
  Brain,
  Droplets,
  Dumbbell,
  Footprints,
  Moon,
} from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const habitsSchema = z.object({
  trackHabits: z.boolean(),
  selectedHabits: z.array(z.string()).max(3, "You can select up to 3 habits"),
});

export function StepHabits() {
  const { data, updateData, setStep } = useOnboardingStore();

  // Initialize selectedHabits from data.habits (which stores objects)
  const initialSelected = Array.isArray(data.habits)
    ? data.habits.map((h) => h.id)
    : [];

  const [trackHabits, setTrackHabits] = useState(initialSelected.length > 0);
  const [selectedHabits, setSelectedHabits] =
    useState<string[]>(initialSelected);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const habitOptions = [
    {
      id: "water",
      label: "Water intake",
      icon: Droplets,
      desc: "8 glasses/day",
      color: "text-blue-500",
    },
    {
      id: "walk",
      label: "Steps/Walking",
      icon: Footprints,
      desc: "10,000 steps",
      color: "text-green-500",
    },
    {
      id: "sleep",
      label: "Sleep",
      icon: Moon,
      desc: "8 hours",
      color: "text-purple-500",
    },
    {
      id: "meditation",
      label: "Meditation",
      icon: Brain,
      desc: "10 min",
      color: "text-violet-500",
    },
    {
      id: "exercise",
      label: "Exercise",
      icon: Dumbbell,
      desc: "30 min",
      color: "text-orange-500",
    },
    {
      id: "no_sugar",
      label: "No sugar/junk",
      icon: Ban,
      desc: "Healthy eating",
      color: "text-red-500",
    },
    {
      id: "reading",
      label: "Reading",
      icon: BookOpen,
      desc: "30 min",
      color: "text-yellow-500",
    },
  ];

  const handleContinue = () => {
    const validationData = {
      trackHabits,
      selectedHabits: trackHabits ? selectedHabits : [],
    };

    const result = habitsSchema.safeParse(validationData);

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

    // Transform selected IDs back to Habit objects for the store
    const habitsToSave = trackHabits
      ? habitOptions
          .filter((h) => selectedHabits.includes(h.id))
          .map((h) => ({ id: h.id, name: h.label, frequency: "daily" })) // Default frequency
      : [];

    updateData("habits", habitsToSave);
    setStep(5);
  };

  const toggleHabit = (id: string) => {
    if (selectedHabits.includes(id)) {
      setSelectedHabits(selectedHabits.filter((h) => h !== id));
    } else {
      if (selectedHabits.length < 3) {
        setSelectedHabits([...selectedHabits, id]);
        setErrors({});
      }
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
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          Habit Tracking
        </h2>
        <p className="text-lg text-muted-foreground">
          Build better habits with daily tracking.
        </p>
      </div>

      <div className="space-y-8">
        {/* Toggle */}
        <div className="flex items-center justify-between p-6 rounded-2xl border bg-card/50">
          <div className="space-y-1">
            <h3 className="font-medium">Do you want to track habits?</h3>
            <p className="text-sm text-muted-foreground">
              You can always change this later
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={trackHabits}
              onChange={(e) => setTrackHabits(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>

        {/* Habit Selector */}
        <motion.div
          animate={{
            opacity: trackHabits ? 1 : 0.5,
            height: trackHabits ? "auto" : "auto",
            pointerEvents: trackHabits ? "auto" : "none",
          }}
          className="space-y-3 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">
              Select Starter Habits (Max 3)
            </label>
            <span className="text-sm font-medium text-muted-foreground">
              {selectedHabits.length}/3 selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {habitOptions.map((habit) => {
              const Icon = habit.icon;
              const isSelected = selectedHabits.includes(habit.id);
              const isDisabled = !isSelected && selectedHabits.length >= 3;

              return (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  disabled={isDisabled && !isSelected}
                  className={cn(
                    "relative flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 group",
                    isSelected
                      ? "border-green-400 bg-green-50 dark:bg-green-950/20"
                      : isDisabled
                      ? "opacity-50 cursor-not-allowed bg-muted/50"
                      : "bg-card hover:border-green-400/50 hover:bg-green-50/50 dark:hover:bg-green-950/20"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      isSelected ? "bg-foreground/10" : "bg-muted"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", habit.color)} />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{habit.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {habit.desc}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-4 right-4 text-green-500"></div>
                  )}
                </button>
              );
            })}
          </div>
          {errors.selectedHabits && (
            <p className="text-sm text-destructive">{errors.selectedHabits}</p>
          )}
        </motion.div>
      </div>

      <div className="pt-8 flex justify-between">
        <button
          onClick={() => setStep(3)}
          className="px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-base font-medium text-white shadow-xl shadow-blue-600/25 transition-all hover:shadow-2xl hover:shadow-blue-600/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 cursor-pointer"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
