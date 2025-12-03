/**
 * Workout Plan Schema Types
 *
 * Hierarchical structure: Program > Phase > Week > Day > ExerciseBlock > Exercise > Set
 * Supports single workouts, weekly plans, and multi-week programs with AI-adaptive tracking.
 */

// ============================================================================
// Core Enums & Types
// ============================================================================

export type PlanType = "single" | "weekly" | "program";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type BlockType = "superset" | "circuit" | "straight" | "emom" | "amrap";
export type SetType = "warmup" | "working" | "dropset" | "failure" | "backoff";
export type FeedbackType =
  | "too_easy"
  | "too_hard"
  | "injury"
  | "missed"
  | "completed";

// ============================================================================
// Set & Exercise Types
// ============================================================================

export interface ActualPerformance {
  reps: number;
  weight: number;
  rpe: number;
  completedAt: string;
  notes?: string;
}

export interface ExerciseSet {
  setNumber: number;
  type: SetType;
  targetReps: number | string; // number or "8-12" or "AMRAP"
  targetWeight?: number | string; // kg or "RPE 8" or "bodyweight"
  targetRpe?: number; // 1-10 scale
  actual?: ActualPerformance; // Logged performance (initially null)
}

export interface MuscleGroups {
  primary: string[];
  secondary: string[];
}

export interface Exercise {
  id: string;
  name: string;
  equipment: string[];
  muscleGroups: MuscleGroups;
  sets: ExerciseSet[];
  restBetweenSets: number; // seconds
  tempo?: string; // "3-1-2-0" (eccentric-pause-concentric-pause)
  notes?: string;
  videoUrl?: string;
  alternatives: string[]; // Alternative exercise names
  cues: string[]; // Form cues (AI coaching)
  commonMistakes: string[]; // Common mistakes to avoid
}

export interface ExerciseBlock {
  id: string;
  type: BlockType;
  exercises: Exercise[];
  restBetweenRounds?: number; // seconds
  rounds?: number; // for circuits
}

// ============================================================================
// Day & Week Types
// ============================================================================

export interface WorkoutDay {
  id: string;
  dayNumber: number; // 1-7 or sequence number
  name: string; // "Push Day", "Upper Body A"
  targetDuration: number; // minutes
  muscleGroups: string[];
  warmup?: ExerciseBlock;
  blocks: ExerciseBlock[];
  cooldown?: ExerciseBlock;
  restDay: boolean;
  notes?: string;
}

export interface Week {
  weekNumber: number;
  focus: string; // "Volume", "Intensity", "Deload"
  isDeload: boolean;
  days: WorkoutDay[];
}

// ============================================================================
// Phase & Program Types
// ============================================================================

export interface Phase {
  id: string;
  name: string; // "Foundation", "Hypertrophy", "Peak"
  objective: string;
  weekStart: number;
  weekEnd: number;
  weeks: Week[];
}

// ============================================================================
// AI Context & Tracking Types
// ============================================================================

export interface AIContext {
  userProfileSnapshot: Record<string, unknown>; // Snapshot at generation time
  generationPrompt: string; // What AI was asked
  modelVersion: string;
}

export interface PersonalRecord {
  exerciseName: string;
  weight: number;
  reps: number;
  achievedAt: string;
  previousRecord?: {
    weight: number;
    reps: number;
    achievedAt: string;
  };
}

export interface FeedbackEntry {
  id: string;
  date: string;
  type: FeedbackType;
  workoutDayId: string;
  notes?: string;
  aiSuggestion?: string; // AI's response to feedback
}

export interface ProgressTracker {
  startedAt?: string;
  currentWeek: number;
  currentDay: number;
  completedWorkouts: string[]; // Array of workout day IDs
  personalRecords: Record<string, PersonalRecord>;
  feedback: FeedbackEntry[];
}

// ============================================================================
// Main Workout Plan Interface
// ============================================================================

export interface WorkoutPlan {
  // Metadata
  id: string;
  version: number; // Schema version for migrations
  generatedAt: string; // ISO timestamp
  planType: PlanType;

  // Program Info
  name: string;
  description: string;
  durationWeeks: number;
  difficulty: Difficulty;
  goal: string; // "build_muscle", "lose_weight", etc.

  // AI Context (for adaptive feedback)
  aiContext: AIContext;

  // The actual program structure
  phases: Phase[];

  // Tracking
  progress: ProgressTracker;
}

// ============================================================================
// Utility Types for Frontend
// ============================================================================

export interface CurrentWorkoutPosition {
  phaseIndex: number;
  weekIndex: number;
  dayIndex: number;
  phase: Phase;
  week: Week;
  day: WorkoutDay;
}

export interface WorkoutStats {
  totalExercises: number;
  totalSets: number;
  completedSets: number;
  completionPercentage: number;
  estimatedDuration: number;
  muscleGroupsCovered: string[];
}

export interface ExerciseProgress {
  exerciseId: string;
  exerciseName: string;
  completedSets: number;
  totalSets: number;
  isComplete: boolean;
}

// ============================================================================
// Default Values Factory
// ============================================================================

export const createDefaultProgressTracker = (): ProgressTracker => ({
  currentWeek: 1,
  currentDay: 1,
  completedWorkouts: [],
  personalRecords: {},
  feedback: [],
});

export const createDefaultAIContext = (): AIContext => ({
  userProfileSnapshot: {},
  generationPrompt: "",
  modelVersion: "1.0",
});

export const CURRENT_SCHEMA_VERSION = 1;
