"use client";

import { LoadingScreen } from "@/components/loading-screen";
import { useSession } from "@/lib/auth-client";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StepBasicProfile } from "./components/step-basic-profile";
import { StepConsent } from "./components/step-consent";
import { StepFinal } from "./components/step-final";
import { StepHabits } from "./components/step-habits";
import { StepHealthConditions } from "./components/step-health-conditions";
import { StepHealthWellness } from "./components/step-health-wellness";
import { StepJournaling } from "./components/step-journaling";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { currentStep } = useOnboardingStore();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Wait for session to load
      if (isPending) return;

      // Check 1: User must be authenticated
      if (!session?.user) {
        router.push("/");
        return;
      }

      // Check 2: Check if onboarding is already completed
      try {
        const response = await fetch("/api/user/onboarding/status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: session.user.id,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const status = data.onBoardingStatus?.toLowerCase().toString().trim();

          // If onboarding is completed, redirect to dashboard
          if (status === "completed") {
            router.push("/dashboard");
            return;
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
      } finally {
        setIsCheckingOnboarding(false);
      }
    };

    if (isMounted) {
      checkOnboardingStatus();
    }
  }, [session, isPending, router, isMounted]);

  // Show loading screen while checking authentication and onboarding status
  if (!isMounted || isPending || isCheckingOnboarding) {
    return <LoadingScreen />;
  }

  // If we reach here, user is authenticated and onboarding is not complete
  return (
    <div className="w-full">
      {currentStep === 1 && <StepBasicProfile />}
      {currentStep === 2 && <StepHealthWellness />}
      {currentStep === 3 && <StepJournaling />}
      {currentStep === 4 && <StepHabits />}
      {currentStep === 5 && <StepHealthConditions />}
      {currentStep === 6 && <StepConsent />}
      {currentStep === 7 && <StepFinal />}
    </div>
  );
}
