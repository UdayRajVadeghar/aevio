import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  completeOnboarding: () => Promise<void>;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      data: {
        basicProfile: {
          name: '',
          dob: undefined,
          gender: '',
        },
        healthWellness: {},
        journaling: {},
        habits: [],
        healthConditions: [],
        consent: false,
        goal: '',
      },
      setStep: (step) => set({ currentStep: step }),
      updateData: (section, data) =>
        set((state) => {
          const currentValue = state.data[section as keyof typeof state.data];
          // Handle arrays directly without spreading
          const newValue = Array.isArray(data) ? data : {
            ...(typeof currentValue === 'object' ? currentValue : {}),
            ...data,
          };
          return {
            data: {
              ...state.data,
              [section]: newValue,
            },
          };
        }),
      saveProgress: async () => {
        // Simulate API call
        console.log('Saving progress...', get().data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
      completeOnboarding: async () => {
        // Simulate API call
        console.log('Completing onboarding...', get().data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
    }),
    {
      name: 'onboarding-storage',
    }
  )
);

