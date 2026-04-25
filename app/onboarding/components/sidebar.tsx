"use client";

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/shadcn/sidebar";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
  { number: 1, title: "Basic Profile" },
  { number: 2, title: "Health & Wellness" },
  { number: 3, title: "Habits" },
  { number: 4, title: "Health Conditions" },
  { number: 5, title: "Consent" },
  { number: 6, title: "Goals" },
];

function SidebarContentComponent() {
  const { currentStep, setStep } = useOnboardingStore();

  const handleStepClick = (stepNumber: number) => {
    // Only allow navigation to current step or previously visited steps
    if (stepNumber <= currentStep) {
      setStep(stepNumber);
    }
  };

  return (
    <>
      <SidebarHeader className="p-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            A
          </div>
          <span className="font-bold text-xl">Aevio</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-6">
        <div className="flex-1 relative py-4">
          {/* Progress Title */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Getting To Know You
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
                      {isCompleted && !isActive ? (
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
      </SidebarContent>
    </>
  );
}

export function OnboardingSidebar({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <ShadcnSidebar collapsible="offcanvas" className="border-r border-border/50">
        <SidebarContentComponent />
      </ShadcnSidebar>
      {children}
    </SidebarProvider>
  );
}
