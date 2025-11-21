"use client";

import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

// Fully optional
const healthConditionsSchema = z.object({
  conditions: z.array(z.string()).optional(),
});

export function StepHealthConditions() {
  const { data, updateData, setStep } = useOnboardingStore();

  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    data.healthConditions || []
  );

  const handleContinue = () => {
    // Always valid as it's optional
    updateData("healthConditions", selectedConditions);
    setStep(6);
  };

  const toggleCondition = (id: string) => {
    if (id === "none") {
      if (selectedConditions.includes("none")) {
        setSelectedConditions([]);
      } else {
        setSelectedConditions(["none"]);
      }
      return;
    }

    // If selecting a condition, remove 'none' if present
    let newConditions = selectedConditions.filter((c) => c !== "none");

    if (newConditions.includes(id)) {
      newConditions = newConditions.filter((c) => c !== id);
    } else {
      newConditions.push(id);
    }
    setSelectedConditions(newConditions);
  };

  const conditionsList = [
    { id: "pcos_thyroid", label: "PCOS / Thyroid" },
    { id: "diabetes", label: "Diabetes" },
    { id: "hypertension", label: "Hypertension" },
    { id: "anxiety_depression", label: "Anxiety / Depression" },
    { id: "insomnia", label: "Insomnia / Sleep Apnea" },
    { id: "digestive_issues", label: "Digestive Issues (IBS/GERD)" },
    { id: "none", label: "None / Prefer not to say" },
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
          Health Conditions
        </h2>
        <p className="text-lg text-muted-foreground">
          Do you have any existing health conditions? This helps us personalize
          your insights.
        </p>
      </div>

      <div className="space-y-8">
        <div className="p-5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex gap-3 items-start text-yellow-700 dark:text-yellow-400">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm leading-relaxed">
            <strong>Disclaimer:</strong> Aevio is not a medical device and does
            not provide medical diagnosis or treatment. The information
            collected is solely for personalized wellness insights.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {conditionsList.map((condition) => {
            const isSelected = selectedConditions.includes(condition.id);
            return (
              <button
                key={condition.id}
                onClick={() => toggleCondition(condition.id)}
                className={cn(
                  "group flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-200",
                  isSelected
                    ? "border-green-400 bg-green-50 dark:bg-green-950/20 shadow-sm"
                    : "bg-card hover:border-green-400/50 hover:bg-green-50/50 dark:hover:bg-green-950/20"
                )}
              >
                <span className="text-sm font-medium">{condition.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-8 flex justify-between">
        <button
          onClick={() => setStep(4)}
          className="px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-base font-medium text-white shadow-xl shadow-blue-600/25 transition-all hover:shadow-2xl hover:shadow-blue-600/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 cursor-pointer"
        >
          {selectedConditions.length === 0 ? "Skip" : "Continue"}
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
