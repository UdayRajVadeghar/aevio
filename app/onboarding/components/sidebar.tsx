"use client";

import { authClient } from "@/lib/auth-client";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
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
  const userId = authClient.useSession().data?.user?.id;

  const { mutate: skipOnboarding } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/user/onboarding/skip`, {
        method: "POST",
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      console.log(data.message);
    },
    onError: (error) => {
      console.error("Failed to skip onboarding", error);
    },
  });

  const handleSkipOnboarding = async () => {
    if (userId === undefined || userId === null) {
      return;
    }

    skipOnboarding();
  };

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

      <button
        onClick={() => handleSkipOnboarding()}
        className="p-3 mb-4 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-2 border-gray-300 dark:border-gray-600 rounded-lg"
      >
        Skip Onboarding
      </button>

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
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 ring-4 ring-blue-500/20"
                    : isCompleted
                    ? "border-green-500 bg-green-500 text-white"
                    : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
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
