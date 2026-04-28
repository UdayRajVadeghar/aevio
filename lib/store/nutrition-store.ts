import { getIstDateKey } from "@/lib/ist-time";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type NutritionState = {
  todayDateKey: string;
  consumedCalories: number;
  syncToday: () => void;
  addConsumedCalories: (calories: number) => void;
  resetConsumedCalories: () => void;
};

function getTodayState() {
  return {
    todayDateKey: getIstDateKey(),
    consumedCalories: 0,
  };
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      ...getTodayState(),
      syncToday: () => {
        const todayDateKey = getIstDateKey();
        if (get().todayDateKey === todayDateKey) {
          return;
        }
        set({
          todayDateKey,
          consumedCalories: 0,
        });
      },
      addConsumedCalories: (calories) => {
        if (!Number.isFinite(calories) || calories <= 0) {
          return;
        }

        const todayDateKey = getIstDateKey();
        const state = get();
        const isSameDay = state.todayDateKey === todayDateKey;
        const nextConsumedCalories = isSameDay
          ? state.consumedCalories + calories
          : calories;

        set({
          todayDateKey,
          consumedCalories: nextConsumedCalories,
        });
      },
      resetConsumedCalories: () => {
        set(getTodayState());
      },
    }),
    {
      name: "nutrition-storage",
    },
  ),
);
