"use client";

import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
  { number: 1, title: "Basic Profile" },
  { number: 2, title: "Health & Wellness" },
  { number: 3, title: "Journaling" },
  { number: 4, title: "Habits" },
  { number: 5, title: "Health Conditions" },
  { number: 6, title: "Consent" },
  { number: 7, title: "Finalize" },
];

export function Sidebar() {
  const { currentStep } = useOnboardingStore();

  return (
    <div className="hidden md:flex flex-col w-80 h-screen bg-muted/30 border-r border-border/50 p-8 flex-shrink-0">
      <div className="mb-12">
        <div className="flex items-center gap-2">
           <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              A
           </div>
           <span className="font-bold text-xl">Aevio</span>
        </div>
      </div>

      <div className="flex flex-col gap-8 relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-4 bottom-4 w-px bg-border/50 -z-10" />

        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div key={step.number} className="flex items-center gap-4">
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center size-8 rounded-full border-2 transition-all duration-300",
                  isActive
                    ? "border-primary bg-background text-primary ring-4 ring-primary/10"
                    : isCompleted
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30 bg-background text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Check size={14} strokeWidth={3} />
                  </motion.div>
                ) : (
                  <span className="text-sm font-semibold">{step.number}</span>
                )}
              </div>
              <div className="flex flex-col">
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    isActive
                      ? "text-foreground font-semibold"
                      : isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

