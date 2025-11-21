"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/dialog";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";

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
  const { currentStep, setStep } = useOnboardingStore();
  const userId = authClient.useSession().data?.user?.id;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate: skipOnboarding, isPending } = useMutation({
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
      setIsDialogOpen(false);
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

  const handleStepClick = (stepNumber: number) => {
    // Only allow navigation to current step or previously visited steps
    if (stepNumber <= currentStep) {
      setStep(stepNumber);
    }
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <button className="p-3 mb-8 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer border-2 border-gray-300 dark:border-gray-600 rounded-lg">
            Skip Onboarding
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Skip Onboarding?</DialogTitle>
            <DialogDescription>
              Are you sure you want to skip the onboarding process? You can
              always complete it later from your profile settings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleSkipOnboarding}
              disabled={isPending}
            >
              {isPending ? "Skipping..." : "Yes, Skip"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-1 relative py-4">
        {/* Progress Title */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Your Progress
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Step {currentStep} of {steps.length}
          </p>
        </div>

        {/* Steps Container */}
        <div className="flex flex-col relative">
          {steps.map((step, index) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const isVisited = step.number <= currentStep;
            const isClickable = isVisited;

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-start gap-4 pb-6 last:pb-0">
                  {/* Step Indicator */}
                  <button
                    onClick={() => handleStepClick(step.number)}
                    disabled={!isClickable}
                    className={cn(
                      "relative z-10 flex items-center justify-center size-8 rounded-full border-2 transition-all duration-300 flex-shrink-0",
                      isActive &&
                        "border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/30",
                      isCompleted &&
                        !isActive &&
                        "border-green-500 bg-green-500 text-white hover:scale-110",
                      !isActive &&
                        !isCompleted &&
                        "border-border bg-background text-muted-foreground",
                      isClickable && !isActive && "cursor-pointer",
                      !isClickable && "cursor-not-allowed opacity-60"
                    )}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                      >
                        <Check size={16} strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <span className="text-xs font-bold">{step.number}</span>
                    )}
                  </button>

                  {/* Step Content */}
                  <button
                    onClick={() => handleStepClick(step.number)}
                    disabled={!isClickable}
                    className={cn(
                      "flex flex-col items-start text-left flex-1 -mt-0.5",
                      isClickable && "cursor-pointer",
                      !isClickable && "cursor-not-allowed"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-medium transition-all duration-300",
                        isActive && "text-foreground font-semibold text-base",
                        isCompleted &&
                          !isActive &&
                          "text-foreground hover:text-primary",
                        !isActive &&
                          !isCompleted &&
                          "text-muted-foreground/70"
                      )}
                    >
                      {step.title}
                    </span>
                    {isActive && (
                      <motion.span
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5"
                      >
                        In Progress
                      </motion.span>
                    )}
                    {isCompleted && !isActive && (
                      <span className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                        Completed
                      </span>
                    )}
                  </button>
                </div>

                {/* Connecting Line (filled for completed steps) */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-4 top-8 w-0.5 h-full transition-all duration-500",
                      isCompleted
                        ? "bg-green-500"
                        : isActive
                        ? "bg-gradient-to-b from-blue-500 to-border"
                        : "bg-border"
                    )}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
