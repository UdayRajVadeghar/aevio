/**
 * Workout Plan Utility Functions
 *
 * Helper functions for navigating, tracking, and manipulating workout plans.
 */

import {
  CURRENT_SCHEMA_VERSION,
  CurrentWorkoutPosition,
  Exercise,
  ExerciseBlock,
  ExerciseProgress,
  FeedbackEntry,
  WorkoutDay,
  WorkoutPlan,
  WorkoutStats,
  createDefaultProgressTracker,
} from "@/lib/types/workout";

// ============================================================================
// Navigation Helpers
// ============================================================================

/**
 * Get the current workout position based on progress tracker
 */
export function getCurrentWorkoutPosition(
  plan: WorkoutPlan
): CurrentWorkoutPosition | null {
  const { currentWeek, currentDay } = plan.progress;

  let cumulativeWeek = 0;

  for (let phaseIndex = 0; phaseIndex < plan.phases.length; phaseIndex++) {
    const phase = plan.phases[phaseIndex];

    for (let weekIndex = 0; weekIndex < phase.weeks.length; weekIndex++) {
      cumulativeWeek++;
      const week = phase.weeks[weekIndex];

      if (cumulativeWeek === currentWeek) {
        const dayIndex = currentDay - 1;
        if (dayIndex >= 0 && dayIndex < week.days.length) {
          return {
            phaseIndex,
            weekIndex,
            dayIndex,
            phase,
            week,
            day: week.days[dayIndex],
          };
        }
      }
    }
  }

  return null;
}

/**
 * Get a specific workout day by ID
 */
export function getWorkoutDayById(
  plan: WorkoutPlan,
  dayId: string
): WorkoutDay | null {
  for (const phase of plan.phases) {
    for (const week of phase.weeks) {
      const day = week.days.find((d) => d.id === dayId);
      if (day) return day;
    }
  }
  return null;
}

/**
 * Get the next workout day (skipping rest days)
 */
export function getNextWorkoutDay(
  plan: WorkoutPlan,
  currentDayId: string
): WorkoutDay | null {
  let foundCurrent = false;

  for (const phase of plan.phases) {
    for (const week of phase.weeks) {
      for (const day of week.days) {
        if (foundCurrent && !day.restDay) {
          return day;
        }
        if (day.id === currentDayId) {
          foundCurrent = true;
        }
      }
    }
  }

  return null;
}

/**
 * Get all workout days as a flat array
 */
export function getAllWorkoutDays(plan: WorkoutPlan): WorkoutDay[] {
  const days: WorkoutDay[] = [];

  for (const phase of plan.phases) {
    for (const week of phase.weeks) {
      days.push(...week.days);
    }
  }

  return days;
}

// ============================================================================
// Exercise Helpers
// ============================================================================

/**
 * Get all exercises from a workout day
 */
export function getExercisesFromDay(day: WorkoutDay): Exercise[] {
  const exercises: Exercise[] = [];

  // Add warmup exercises
  if (day.warmup) {
    exercises.push(...day.warmup.exercises);
  }

  // Add main workout exercises
  for (const block of day.blocks) {
    exercises.push(...block.exercises);
  }

  // Add cooldown exercises
  if (day.cooldown) {
    exercises.push(...day.cooldown.exercises);
  }

  return exercises;
}

/**
 * Get the next incomplete exercise in a workout day
 */
export function getNextIncompleteExercise(day: WorkoutDay): Exercise | null {
  const exercises = getExercisesFromDay(day);

  for (const exercise of exercises) {
    const hasIncompleteSets = exercise.sets.some((set) => !set.actual);
    if (hasIncompleteSets) {
      return exercise;
    }
  }

  return null;
}

/**
 * Check if an exercise is complete
 */
export function isExerciseComplete(exercise: Exercise): boolean {
  return exercise.sets.every((set) => set.actual !== undefined);
}

/**
 * Get exercise progress summary
 */
export function getExerciseProgress(exercise: Exercise): ExerciseProgress {
  const completedSets = exercise.sets.filter((set) => set.actual).length;
  const totalSets = exercise.sets.length;

  return {
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    completedSets,
    totalSets,
    isComplete: completedSets === totalSets,
  };
}

// ============================================================================
// Statistics Helpers
// ============================================================================

/**
 * Calculate workout day statistics
 */
export function getWorkoutDayStats(day: WorkoutDay): WorkoutStats {
  const exercises = getExercisesFromDay(day);

  let totalSets = 0;
  let completedSets = 0;
  const muscleGroups = new Set<string>();

  for (const exercise of exercises) {
    totalSets += exercise.sets.length;
    completedSets += exercise.sets.filter((set) => set.actual).length;

    exercise.muscleGroups.primary.forEach((mg) => muscleGroups.add(mg));
    exercise.muscleGroups.secondary.forEach((mg) => muscleGroups.add(mg));
  }

  const completionPercentage =
    totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return {
    totalExercises: exercises.length,
    totalSets,
    completedSets,
    completionPercentage,
    estimatedDuration: day.targetDuration,
    muscleGroupsCovered: Array.from(muscleGroups),
  };
}

/**
 * Calculate overall plan progress
 */
export function getPlanProgress(plan: WorkoutPlan): {
  completedWorkouts: number;
  totalWorkouts: number;
  completionPercentage: number;
  currentPhase: string;
  weeksCompleted: number;
  totalWeeks: number;
} {
  const allDays = getAllWorkoutDays(plan);
  const workoutDays = allDays.filter((d) => !d.restDay);
  const completedWorkouts = plan.progress.completedWorkouts.length;

  const position = getCurrentWorkoutPosition(plan);
  const currentPhase = position?.phase.name ?? plan.phases[0]?.name ?? "N/A";

  return {
    completedWorkouts,
    totalWorkouts: workoutDays.length,
    completionPercentage:
      workoutDays.length > 0
        ? Math.round((completedWorkouts / workoutDays.length) * 100)
        : 0,
    currentPhase,
    weeksCompleted: plan.progress.currentWeek - 1,
    totalWeeks: plan.durationWeeks,
  };
}

// ============================================================================
// Tracking & Logging Helpers
// ============================================================================

/**
 * Log a completed set for an exercise
 */
export function logSetCompletion(
  plan: WorkoutPlan,
  dayId: string,
  exerciseId: string,
  setNumber: number,
  actual: {
    reps: number;
    weight: number;
    rpe: number;
    notes?: string;
  }
): WorkoutPlan {
  const updatedPlan = structuredClone(plan);

  for (const phase of updatedPlan.phases) {
    for (const week of phase.weeks) {
      for (const day of week.days) {
        if (day.id !== dayId) continue;

        const allBlocks = [day.warmup, ...day.blocks, day.cooldown].filter(
          Boolean
        ) as ExerciseBlock[];

        for (const block of allBlocks) {
          const exercise = block.exercises.find((e) => e.id === exerciseId);
          if (!exercise) continue;

          const set = exercise.sets.find((s) => s.setNumber === setNumber);
          if (set) {
            set.actual = {
              ...actual,
              completedAt: new Date().toISOString(),
            };
          }
        }
      }
    }
  }

  return updatedPlan;
}

/**
 * Mark a workout day as complete
 */
export function markWorkoutComplete(
  plan: WorkoutPlan,
  dayId: string
): WorkoutPlan {
  const updatedPlan = structuredClone(plan);

  if (!updatedPlan.progress.completedWorkouts.includes(dayId)) {
    updatedPlan.progress.completedWorkouts.push(dayId);
  }

  // Advance to next day
  const allDays = getAllWorkoutDays(updatedPlan);
  const currentIndex = allDays.findIndex((d) => d.id === dayId);

  if (currentIndex >= 0 && currentIndex < allDays.length - 1) {
    // Find next non-rest day
    for (let i = currentIndex + 1; i < allDays.length; i++) {
      if (!allDays[i].restDay) {
        // Calculate week and day numbers
        let weekNum = 1;
        let dayNum = 1;
        let count = 0;

        outer: for (const phase of updatedPlan.phases) {
          for (const week of phase.weeks) {
            for (let d = 0; d < week.days.length; d++) {
              if (count === i) {
                dayNum = d + 1;
                break outer;
              }
              count++;
            }
            weekNum++;
          }
        }

        updatedPlan.progress.currentWeek = weekNum;
        updatedPlan.progress.currentDay = dayNum;
        break;
      }
    }
  }

  return updatedPlan;
}

/**
 * Add feedback entry
 */
export function addFeedback(
  plan: WorkoutPlan,
  feedback: Omit<FeedbackEntry, "id" | "date">
): WorkoutPlan {
  const updatedPlan = structuredClone(plan);

  updatedPlan.progress.feedback.push({
    ...feedback,
    id: `fb_${Date.now()}`,
    date: new Date().toISOString(),
  });

  return updatedPlan;
}

/**
 * Update personal record if new achievement
 */
export function checkAndUpdatePR(
  plan: WorkoutPlan,
  exerciseName: string,
  weight: number,
  reps: number
): WorkoutPlan {
  const updatedPlan = structuredClone(plan);
  const key = exerciseName.toLowerCase().replace(/\s+/g, "_");

  const currentPR = updatedPlan.progress.personalRecords[key];

  // Simple 1RM estimation: weight × (1 + reps/30)
  const newEstimated1RM = weight * (1 + reps / 30);
  const currentEstimated1RM = currentPR
    ? currentPR.weight * (1 + currentPR.reps / 30)
    : 0;

  if (newEstimated1RM > currentEstimated1RM) {
    updatedPlan.progress.personalRecords[key] = {
      exerciseName,
      weight,
      reps,
      achievedAt: new Date().toISOString(),
      previousRecord: currentPR
        ? {
            weight: currentPR.weight,
            reps: currentPR.reps,
            achievedAt: currentPR.achievedAt,
          }
        : undefined,
    };
  }

  return updatedPlan;
}

// ============================================================================
// Formatting Helpers
// ============================================================================

/**
 * Format rest time in human-readable format
 */
export function formatRestTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

/**
 * Format target reps (handles ranges and AMRAP)
 */
export function formatTargetReps(reps: number | string): string {
  if (typeof reps === "number") {
    return String(reps);
  }
  return reps.toUpperCase();
}

/**
 * Format weight with unit
 */
export function formatWeight(
  weight: number | string | undefined,
  unit: "kg" | "lbs" = "kg"
): string {
  if (weight === undefined) return "-";
  if (typeof weight === "string") return weight;
  return `${weight}${unit}`;
}

/**
 * Parse tempo string into components
 */
export function parseTempo(tempo: string): {
  eccentric: number;
  pauseBottom: number;
  concentric: number;
  pauseTop: number;
} | null {
  const parts = tempo.split("-").map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return null;

  return {
    eccentric: parts[0],
    pauseBottom: parts[1],
    concentric: parts[2],
    pauseTop: parts[3],
  };
}

/**
 * Get muscle group display color
 */
export function getMuscleGroupColor(muscleGroup: string): string {
  const colors: Record<string, string> = {
    chest: "bg-rose-500",
    back: "bg-blue-500",
    legs: "bg-emerald-500",
    shoulders: "bg-cyan-500",
    arms: "bg-orange-500",
    biceps: "bg-orange-400",
    triceps: "bg-orange-600",
    abs: "bg-purple-500",
    core: "bg-purple-400",
    glutes: "bg-pink-500",
    hamstrings: "bg-green-600",
    quads: "bg-green-500",
    calves: "bg-teal-500",
  };

  return colors[muscleGroup.toLowerCase()] ?? "bg-neutral-500";
}

/**
 * Get block type display info
 */
export function getBlockTypeInfo(type: ExerciseBlock["type"]): {
  label: string;
  description: string;
  color: string;
} {
  const info: Record<
    ExerciseBlock["type"],
    { label: string; description: string; color: string }
  > = {
    straight: {
      label: "Straight Sets",
      description:
        "Complete all sets of one exercise before moving to the next",
      color: "bg-neutral-500",
    },
    superset: {
      label: "Superset",
      description: "Alternate between exercises with minimal rest",
      color: "bg-amber-500",
    },
    circuit: {
      label: "Circuit",
      description: "Perform exercises back-to-back, then rest",
      color: "bg-red-500",
    },
    emom: {
      label: "EMOM",
      description: "Every Minute On the Minute",
      color: "bg-blue-500",
    },
    amrap: {
      label: "AMRAP",
      description: "As Many Rounds As Possible",
      color: "bg-purple-500",
    },
  };

  return info[type];
}

// ============================================================================
// Validation & Migration
// ============================================================================

/**
 * Validate workout plan structure
 */
export function validateWorkoutPlan(plan: unknown): plan is WorkoutPlan {
  if (!plan || typeof plan !== "object") return false;

  const p = plan as Record<string, unknown>;

  return (
    typeof p.id === "string" &&
    typeof p.version === "number" &&
    typeof p.name === "string" &&
    Array.isArray(p.phases) &&
    p.progress !== undefined
  );
}

/**
 * Migrate plan to current schema version
 */
export function migratePlan(plan: WorkoutPlan): WorkoutPlan {
  if (plan.version === CURRENT_SCHEMA_VERSION) {
    return plan;
  }

  const migrated = structuredClone(plan);

  // Add migration logic here as schema evolves
  // Example:
  // if (migrated.version < 2) {
  //   // Migrate from v1 to v2
  //   migrated.version = 2;
  // }

  migrated.version = CURRENT_SCHEMA_VERSION;
  return migrated;
}

/**
 * Initialize a fresh workout plan with defaults
 */
export function createEmptyWorkoutPlan(
  overrides: Partial<WorkoutPlan> = {}
): WorkoutPlan {
  return {
    id: `wrk_${Date.now()}`,
    version: CURRENT_SCHEMA_VERSION,
    generatedAt: new Date().toISOString(),
    planType: "program",
    name: "New Workout Plan",
    description: "",
    durationWeeks: 4,
    difficulty: "intermediate",
    goal: "general_fitness",
    aiContext: {
      userProfileSnapshot: {},
      generationPrompt: "",
      modelVersion: "1.0",
    },
    phases: [],
    progress: createDefaultProgressTracker(),
    ...overrides,
  };
}

/**
 * Generate unique ID for workout elements
 */
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
