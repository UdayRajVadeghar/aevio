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

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { currentStep, updateData, setStep } = useOnboardingStore();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [hasHydratedProfileData, setHasHydratedProfileData] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (isPending) return;

    if (!session?.user) {
      router.push("/");
      return;
    }

    setIsCheckingOnboarding(false);
  }, [session, isPending, router, isMounted]);

  useEffect(() => {
    const hydrateProfileData = async () => {
      if (!isMounted || isPending || !session?.user) return;
      if (hasHydratedProfileData) return;

      try {
        const response = await fetch(
          `/api/user/profile?userId=${encodeURIComponent(session.user.id)}`
        );
        if (!response.ok) {
          setHasHydratedProfileData(true);
          return;
        }

        const profileData = await response.json();
        updateData("basicProfile", {
          name: profileData.basicProfile?.name || "",
          dob: profileData.basicProfile?.dob
            ? new Date(profileData.basicProfile.dob)
            : undefined,
          gender: profileData.basicProfile?.gender || "",
        });
        updateData("healthWellness", {
          height: profileData.healthWellness?.height ?? 170,
          weight: profileData.healthWellness?.weight ?? 70,
          activityLevel: profileData.healthWellness?.activityLevel || "",
          primaryGoal: profileData.healthWellness?.primaryGoal || "",
          dietaryPreference: profileData.healthWellness?.dietaryPreference || "",
        });
        updateData(
          "habits",
          (profileData.habits || []).map(
            (habit: {
              id?: string;
              name?: string;
              target?: number | null;
              unit?: string | null;
            }) => ({
              id: habit.id || "",
              name: habit.name || "",
              frequency:
                habit.target && habit.unit
                  ? `${habit.target} ${habit.unit}`
                  : "",
            })
          )
        );
        updateData("healthConditions", profileData.healthConditions || []);
        updateData("goal", profileData.goal || "");
        updateData("caloriesIntake", profileData.caloriesIntake ?? null);
        updateData(
          "calorieGoalEndDate",
          profileData.calorieGoalEndDate
            ? new Date(profileData.calorieGoalEndDate)
            : undefined
        );
        setStep(1);
      } catch (error) {
        console.error("Error hydrating onboarding data:", error);
      } finally {
        setHasHydratedProfileData(true);
      }
    };

    hydrateProfileData();
  }, [
    hasHydratedProfileData,
    isMounted,
    isPending,
    session,
    setStep,
    updateData,
  ]);

  // Show loading screen while checking authentication and onboarding status
  if (!isMounted || isPending || isCheckingOnboarding) {
    return <LoadingScreen />;
  }

  // If we reach here, user is authenticated and onboarding is not complete
  return (
    <div className="w-full">
      {currentStep === 1 && <StepBasicProfile />}
      {currentStep === 2 && <StepHealthWellness />}
      {currentStep === 3 && <StepHabits />}
      {currentStep === 4 && <StepHealthConditions />}
      {currentStep === 5 && <StepConsent />}
      {currentStep === 6 && <StepFinal />}
    </div>
  );
}
