"use client";

import { Button } from "@/components/ui/shadcn/button";
import {
  ExerciseBlock,
  Phase,
  Week,
  WorkoutDay,
  WorkoutPlan,
} from "@/lib/types/workout";
import {
  formatRestTime,
  getBlockTypeInfo,
  getCurrentWorkoutPosition,
  getMuscleGroupColor,
  getPlanProgress,
  getWorkoutDayStats,
} from "@/lib/utils/workout-helpers";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Play,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ExerciseCard } from "./ExerciseCard";

// ============================================================================
// Types
// ============================================================================

interface WorkoutPlanViewProps {
  plan: WorkoutPlan;
  onStartWorkout?: (dayId: string) => void;
  onUpdatePlan?: (plan: WorkoutPlan) => void;
}

// ============================================================================
// Sub-Components
// ============================================================================

function ProgressRing({
  percentage,
  size = 120,
  strokeWidth = 8,
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-neutral-200 dark:text-neutral-800"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold">{percentage}%</span>
        <span className="text-xs text-neutral-500">Complete</span>
      </div>
    </div>
  );
}

function ProgramHeader({
  plan,
  progress,
}: {
  plan: WorkoutPlan;
  progress: ReturnType<typeof getPlanProgress>;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 md:p-8 shadow-xl"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Progress Ring */}
        <ProgressRing percentage={progress.completionPercentage} />

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                plan.difficulty === "beginner"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : plan.difficulty === "intermediate"
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {plan.difficulty.charAt(0).toUpperCase() +
                plan.difficulty.slice(1)}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {plan.durationWeeks} Weeks
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">{plan.name}</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-4">
            {plan.description}
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-orange-500" />
              <span>
                Week {progress.weeksCompleted + 1} of {progress.totalWeeks}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Dumbbell className="w-4 h-4 text-blue-500" />
              <span>
                {progress.completedWorkouts} / {progress.totalWorkouts} workouts
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-purple-500" />
              <span>{progress.currentPhase}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PhaseNavigator({
  phases,
  selectedPhaseIndex,
  onSelectPhase,
}: {
  phases: Phase[];
  selectedPhaseIndex: number;
  onSelectPhase: (index: number) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {phases.map((phase, index) => (
        <button
          key={phase.id}
          onClick={() => onSelectPhase(index)}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            selectedPhaseIndex === index
              ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
          }`}
        >
          {phase.name}
        </button>
      ))}
    </div>
  );
}

function WeekCarousel({
  weeks,
  selectedWeekIndex,
  onSelectWeek,
}: {
  weeks: Week[];
  selectedWeekIndex: number;
  onSelectWeek: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onSelectWeek(Math.max(0, selectedWeekIndex - 1))}
        disabled={selectedWeekIndex === 0}
        className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex gap-2 overflow-x-auto flex-1 scrollbar-hide px-1">
        {weeks.map((week, index) => (
          <button
            key={week.weekNumber}
            onClick={() => onSelectWeek(index)}
            className={`min-w-[100px] px-4 py-3 rounded-xl text-center transition-all ${
              selectedWeekIndex === index
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                : week.isDeload
                ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
                : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            }`}
          >
            <div className="text-xs opacity-70">Week</div>
            <div className="text-lg font-bold">{week.weekNumber}</div>
            {week.isDeload && (
              <div className="text-xs mt-1 opacity-80">Deload</div>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() =>
          onSelectWeek(Math.min(weeks.length - 1, selectedWeekIndex + 1))
        }
        disabled={selectedWeekIndex === weeks.length - 1}
        className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function DayCard({
  day,
  isActive,
  isCompleted,
  onStart,
  onSelect,
}: {
  day: WorkoutDay;
  isActive: boolean;
  isCompleted: boolean;
  onStart: () => void;
  onSelect: () => void;
}) {
  const stats = getWorkoutDayStats(day);

  if (day.restDay) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-6 text-center"
      >
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
          <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">
          Rest Day
        </h3>
        <p className="text-sm text-emerald-600/70 dark:text-emerald-500/70 mt-1">
          Recovery & regeneration
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={onSelect}
      className={`relative bg-white dark:bg-neutral-900 border rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg ${
        isActive
          ? "border-orange-400 dark:border-orange-500 ring-2 ring-orange-400/20"
          : isCompleted
          ? "border-emerald-300 dark:border-emerald-700"
          : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
      }`}
    >
      {/* Completion badge */}
      {isCompleted && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
          <Trophy className="w-4 h-4 text-white" />
        </div>
      )}

      {/* Day header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
            Day {day.dayNumber}
          </div>
          <h3 className="font-bold text-lg">{day.name}</h3>
        </div>
        <div className="flex items-center gap-1 text-sm text-neutral-500">
          <Clock className="w-4 h-4" />
          <span>{day.targetDuration}m</span>
        </div>
      </div>

      {/* Muscle groups */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {day.muscleGroups.slice(0, 4).map((mg) => (
          <span
            key={mg}
            className={`px-2 py-0.5 rounded-full text-xs text-white ${getMuscleGroupColor(
              mg
            )}`}
          >
            {mg}
          </span>
        ))}
        {day.muscleGroups.length > 4 && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-neutral-200 dark:bg-neutral-700">
            +{day.muscleGroups.length - 4}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400 mb-4">
        <span>{stats.totalExercises} exercises</span>
        <span>{stats.totalSets} sets</span>
      </div>

      {/* Progress bar */}
      {stats.completedSets > 0 && (
        <div className="mb-4">
          <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionPercentage}%` }}
            />
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            {stats.completionPercentage}% complete
          </div>
        </div>
      )}

      {/* Action button */}
      {isActive && !isCompleted && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onStart();
          }}
          className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Workout
        </Button>
      )}
    </motion.div>
  );
}

function ExerciseBlockRenderer({
  block,
  dayId,
  onUpdatePlan,
}: {
  block: ExerciseBlock;
  dayId: string;
  onUpdatePlan?: (plan: WorkoutPlan) => void;
}) {
  const blockInfo = getBlockTypeInfo(block.type);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-6">
      {/* Block header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-3 w-full text-left mb-3"
      >
        <div
          className={`w-8 h-8 rounded-lg ${blockInfo.color} flex items-center justify-center`}
        >
          <Flame className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">{blockInfo.label}</div>
          <div className="text-xs text-neutral-500">
            {blockInfo.description}
          </div>
        </div>
        {block.restBetweenRounds && (
          <span className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded-lg">
            Rest: {formatRestTime(block.restBetweenRounds)}
          </span>
        )}
        <ChevronRight
          className={`w-5 h-5 text-neutral-400 transition-transform ${
            isExpanded ? "rotate-90" : ""
          }`}
        />
      </button>

      {/* Exercises */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-3 overflow-hidden"
          >
            {block.exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                dayId={dayId}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DayDetailView({
  day,
  onClose,
  onUpdatePlan,
}: {
  day: WorkoutDay;
  onClose: () => void;
  onUpdatePlan?: (plan: WorkoutPlan) => void;
}) {
  const stats = getWorkoutDayStats(day);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800 p-6 z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-neutral-500 mb-1">
                Day {day.dayNumber}
              </div>
              <h2 className="text-2xl font-bold">{day.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Quick stats */}
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>{day.targetDuration} min</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Dumbbell className="w-4 h-4 text-orange-500" />
              <span>{stats.totalExercises} exercises</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>{stats.totalSets} sets</span>
            </div>
          </div>

          {/* Muscle groups */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {day.muscleGroups.map((mg) => (
              <span
                key={mg}
                className={`px-2 py-0.5 rounded-full text-xs text-white ${getMuscleGroupColor(
                  mg
                )}`}
              >
                {mg}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warmup */}
          {day.warmup && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                Warmup
              </h3>
              <ExerciseBlockRenderer
                block={day.warmup}
                dayId={day.id}
                onUpdatePlan={onUpdatePlan}
              />
            </div>
          )}

          {/* Main Workout */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              Main Workout
            </h3>
            {day.blocks.map((block) => (
              <ExerciseBlockRenderer
                key={block.id}
                block={block}
                dayId={day.id}
                onUpdatePlan={onUpdatePlan}
              />
            ))}
          </div>

          {/* Cooldown */}
          {day.cooldown && (
            <div>
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                Cooldown
              </h3>
              <ExerciseBlockRenderer
                block={day.cooldown}
                dayId={day.id}
                onUpdatePlan={onUpdatePlan}
              />
            </div>
          )}

          {/* Notes */}
          {day.notes && (
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">
                Notes
              </h4>
              <p className="text-sm text-amber-600 dark:text-amber-500">
                {day.notes}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function WorkoutPlanView({
  plan,
  onStartWorkout,
  onUpdatePlan,
}: WorkoutPlanViewProps) {
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(0);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);

  const progress = useMemo(() => getPlanProgress(plan), [plan]);
  const currentPosition = useMemo(
    () => getCurrentWorkoutPosition(plan),
    [plan]
  );

  const currentPhase = plan.phases[selectedPhaseIndex];
  const currentWeek = currentPhase?.weeks[selectedWeekIndex];

  // Auto-select current position on mount
  useMemo(() => {
    if (currentPosition) {
      setSelectedPhaseIndex(currentPosition.phaseIndex);
      setSelectedWeekIndex(currentPosition.weekIndex);
    }
  }, []);

  if (!plan.phases.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Dumbbell className="w-16 h-16 text-neutral-300 dark:text-neutral-700 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Workout Plan Yet</h3>
        <p className="text-neutral-500 max-w-md">
          Generate your personalized workout plan to get started on your fitness
          journey.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Program Header */}
      <ProgramHeader plan={plan} progress={progress} />

      {/* Phase Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-3">
          Program Phases
        </h3>
        <PhaseNavigator
          phases={plan.phases}
          selectedPhaseIndex={selectedPhaseIndex}
          onSelectPhase={(index) => {
            setSelectedPhaseIndex(index);
            setSelectedWeekIndex(0);
          }}
        />
      </motion.div>

      {/* Week Carousel */}
      {currentPhase && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
              {currentPhase.name} - Weeks
            </h3>
            <span className="text-sm text-neutral-500">
              {currentPhase.objective}
            </span>
          </div>
          <WeekCarousel
            weeks={currentPhase.weeks}
            selectedWeekIndex={selectedWeekIndex}
            onSelectWeek={setSelectedWeekIndex}
          />
        </motion.div>
      )}

      {/* Week Days Grid */}
      {currentWeek && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">
              Week {currentWeek.weekNumber} - {currentWeek.focus}
            </h3>
            {currentWeek.isDeload && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                Deload Week
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentWeek.days.map((day) => {
              const isActive = currentPosition?.day.id === day.id;
              const isCompleted = plan.progress.completedWorkouts.includes(
                day.id
              );

              return (
                <DayCard
                  key={day.id}
                  day={day}
                  isActive={isActive}
                  isCompleted={isCompleted}
                  onStart={() => onStartWorkout?.(day.id)}
                  onSelect={() => setSelectedDay(day)}
                />
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Day Detail Modal */}
      <AnimatePresence>
        {selectedDay && (
          <DayDetailView
            day={selectedDay}
            onClose={() => setSelectedDay(null)}
            onUpdatePlan={onUpdatePlan}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default WorkoutPlanView;
