import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WorkoutPlannerFormData {
  // Experience
  trainingExperience: string;
  motivationStyle: string;

  // Body
  bodyFatPercentage: number | null;
  waistCircumference: number | null;
  hipCircumference: number | null;
  restingHeartRate: number | null;

  // Lifestyle
  workType: string;
  stressLevel: number;
  sleepHours: number | null;
  stepCount: number | null;

  // Schedule
  workoutDays: number;
  workoutDuration: number;

  // Preferences
  trainingStyle: string[];
  targetBodyParts: string[];
  equipmentAvailable: string[];
  exerciseDislikes: string[];

  // Safety
  injuries: { description: string }[] | null;
}

export interface WorkoutPlannerState {
  currentStep: number;
  formData: WorkoutPlannerFormData;
  setStep: (step: number) => void;
  updateField: <K extends keyof WorkoutPlannerFormData>(
    field: K,
    value: WorkoutPlannerFormData[K]
  ) => void;
  toggleArrayItem: (
    field: "trainingStyle" | "targetBodyParts" | "equipmentAvailable",
    item: string
  ) => void;
  resetStore: () => void;
  completeWorkoutPlanner: (userId: string) => Promise<void>;
}

const initialFormData: WorkoutPlannerFormData = {
  trainingExperience: "",
  motivationStyle: "",
  bodyFatPercentage: null,
  waistCircumference: null,
  hipCircumference: null,
  restingHeartRate: null,
  workType: "",
  stressLevel: 3,
  sleepHours: null,
  stepCount: null,
  workoutDays: 3,
  workoutDuration: 45,
  trainingStyle: [],
  targetBodyParts: [],
  equipmentAvailable: [],
  exerciseDislikes: [],
  injuries: null,
};

export const useWorkoutPlannerStore = create<WorkoutPlannerState>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      formData: { ...initialFormData },

      setStep: (step) => set({ currentStep: step }),

      updateField: (field, value) =>
        set((state) => ({
          formData: {
            ...state.formData,
            [field]: value,
          },
        })),

      toggleArrayItem: (field, item) =>
        set((state) => {
          const current = state.formData[field];
          if (current.includes(item)) {
            return {
              formData: {
                ...state.formData,
                [field]: current.filter((i) => i !== item),
              },
            };
          } else {
            return {
              formData: {
                ...state.formData,
                [field]: [...current, item],
              },
            };
          }
        }),

      resetStore: () =>
        set({
          currentStep: 0,
          formData: { ...initialFormData },
        }),

      completeWorkoutPlanner: async (userId: string) => {
        const { formData } = get();

        const response = await fetch("/api/user/workout-planner/complete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            workoutPlannerData: formData,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Failed to complete workout planner");
        }

        // Reset the store after successful completion
        get().resetStore();

        return await response.json();
      },
    }),
    {
      name: "workout-planner-storage",
    }
  )
);

