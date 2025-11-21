import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Habit {
  id: string;
  name: string;
  frequency: string;
}

export interface OnboardingState {
  currentStep: number;
  data: {
    basicProfile: {
      name: string;
      dob: Date | undefined;
      gender: string;
    };
    healthWellness: Record<string, any>;
    journaling: Record<string, any>;
    habits: Habit[];
    healthConditions: string[];
    consent: boolean;
    goal: string;
  };
  setStep: (step: number) => void;
  updateData: (section: string, data: any) => void;
  saveProgress: () => Promise<void>;
  completeOnboarding: (userId: string) => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      data: {
        basicProfile: {
          name: "",
          dob: undefined,
          gender: "",
        },
        healthWellness: {},
        journaling: {},
        habits: [],
        healthConditions: [],
        consent: false,
        goal: "",
      },
      setStep: (step) => set({ currentStep: step }),
      updateData: (section, data) =>
        set((state) => {
          const currentValue = state.data[section as keyof typeof state.data];
          // Handle different data types
          let newValue;
          if (Array.isArray(data)) {
            // Arrays: replace directly
            newValue = data;
          } else if (typeof data === "object" && data !== null) {
            // Objects: merge with existing
            newValue = {
              ...(typeof currentValue === "object" &&
              !Array.isArray(currentValue)
                ? currentValue
                : {}),
              ...data,
            };
          } else {
            // Primitives (boolean, string, number): replace directly
            newValue = data;
          }
          return {
            data: {
              ...state.data,
              [section]: newValue,
            },
          };
        }),
      saveProgress: async () => {
        // Simulate API call
        console.log("Saving progress...", get().data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
      completeOnboarding: async (userId: string) => {
        const storeData = get().data;

        // Mapping for habit data based on habit ID
        const habitMappings: Record<
          string,
          { type: string; target: number; unit: string }
        > = {
          water: { type: "count", target: 8, unit: "glasses" },
          walk: { type: "count", target: 10000, unit: "steps" },
          sleep: { type: "duration", target: 8, unit: "hours" },
          meditation: { type: "duration", target: 10, unit: "minutes" },
          exercise: { type: "duration", target: 30, unit: "minutes" },
          no_sugar: { type: "boolean", target: 1, unit: "times" },
          reading: { type: "duration", target: 30, unit: "minutes" },
        };

        // Format the data according to the backend schema
        // Note: dob might be a Date or string (from localStorage), backend will coerce it
        const onBoardingData = {
          basicProfile: {
            name: storeData.basicProfile.name,
            dob: storeData.basicProfile.dob,
            gender: storeData.basicProfile.gender,
          },
          healthWellness: {
            height: storeData.healthWellness.height,
            weight: storeData.healthWellness.weight,
            activityLevel: storeData.healthWellness.activityLevel,
            primaryGoal: storeData.healthWellness.primaryGoal,
            dietaryPreference: storeData.healthWellness.dietaryPreference,
          },
          journaling: {
            journalingStyle: storeData.journaling.style || "",
            journalingTimeOfDay: storeData.journaling.timeOfDay || "",
            moodTrackingEnabled:
              typeof storeData.journaling.moodTracking === "boolean"
                ? storeData.journaling.moodTracking
                : false,
          },
          habits: storeData.habits.map((habit) => {
            const mapping = habitMappings[habit.id] || {
              type: "count",
              target: 1,
              unit: "times",
            };
            return {
              name: habit.name,
              type: mapping.type,
              target: mapping.target,
              unit: mapping.unit,
              enabled: true,
            };
          }),
          healthConditions: storeData.healthConditions || [],
          consent:
            typeof storeData.consent === "boolean" ? storeData.consent : false,
          goal: storeData.goal || "",
        };

        const response = await fetch("/api/user/onboarding/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            onBoardingData,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to complete onboarding");
        }

        return await response.json();
      },
    }),
    {
      name: "onboarding-storage",
    }
  )
);
