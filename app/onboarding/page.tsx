"use client";

import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { StepBasicProfile } from "./components/step-basic-profile";
import { StepHealthWellness } from "./components/step-health-wellness";
import { StepJournaling } from "./components/step-journaling";
import { StepHabits } from "./components/step-habits";
import { StepHealthConditions } from "./components/step-health-conditions";
import { StepConsent } from "./components/step-consent";
import { StepFinal } from "./components/step-final";
import { useEffect, useState } from "react";

export default function OnboardingPage() {
  const { currentStep } = useOnboardingStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a loading spinner
  }

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
