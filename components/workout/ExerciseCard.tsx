"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Input } from "@/components/ui/shadcn/input";
import {
  Exercise,
  ExerciseSet,
  ActualPerformance,
} from "@/lib/types/workout";
import {
  formatRestTime,
  formatTargetReps,
  formatWeight,
  getMuscleGroupColor,
  getExerciseProgress,
  parseTempo,
} from "@/lib/utils/workout-helpers";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Dumbbell,
  Info,
  Lightbulb,
  Play,
  RefreshCw,
  Target,
  X,
} from "lucide-react";
import { useState } from "react";

// ============================================================================
// Types
// ============================================================================

interface ExerciseCardProps {
  exercise: Exercise;
  dayId: string;
  onLogSet?: (
    exerciseId: string,
    setNumber: number,
    actual: ActualPerformance
  ) => void;
  compact?: boolean;
}

interface SetRowProps {
  set: ExerciseSet;
  exerciseId: string;
  restTime: number;
  onLogSet?: (
    exerciseId: string,
    setNumber: number,
    actual: ActualPerformance
  ) => void;
}

// ============================================================================
// Sub-Components
// ============================================================================

function SetTypeBadge({ type }: { type: ExerciseSet["type"] }) {
  const styles: Record<ExerciseSet["type"], { bg: string; text: string }> = {
    warmup: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
    },
    working: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-600 dark:text-orange-400",
    },
    dropset: {
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-600 dark:text-purple-400",
    },
    failure: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-600 dark:text-red-400",
    },
    backoff: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-600 dark:text-emerald-400",
    },
  };

  const style = styles[type];

  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.text}`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

function SetRow({ set, exerciseId, restTime, onLogSet }: SetRowProps) {
  const [isLogging, setIsLogging] = useState(false);
  const [logData, setLogData] = useState({
    reps: typeof set.targetReps === "number" ? set.targetReps : 0,
    weight: typeof set.targetWeight === "number" ? set.targetWeight : 0,
    rpe: set.targetRpe ?? 7,
    notes: "",
  });

  const isComplete = !!set.actual;

  const handleSubmitLog = () => {
    onLogSet?.(exerciseId, set.setNumber, {
      ...logData,
      completedAt: new Date().toISOString(),
    });
    setIsLogging(false);
  };

  return (
    <div
      className={`relative group ${
        isComplete
          ? "bg-emerald-50 dark:bg-emerald-900/10"
          : "bg-neutral-50 dark:bg-neutral-800/50"
      } rounded-xl p-3 transition-all`}
    >
      <div className="flex items-center gap-3">
        {/* Set number indicator */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            isComplete
              ? "bg-emerald-500 text-white"
              : "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300"
          }`}
        >
          {isComplete ? <Check className="w-4 h-4" /> : set.setNumber}
        </div>

        {/* Set info */}
        <div className="flex-1 grid grid-cols-3 gap-2 text-sm">
          {/* Type */}
          <div>
            <SetTypeBadge type={set.type} />
          </div>

          {/* Target */}
          <div className="text-center">
            <span className="text-neutral-500 dark:text-neutral-400 text-xs block">
              Target
            </span>
            <span className="font-semibold">
              {formatTargetReps(set.targetReps)} reps
            </span>
            {set.targetWeight && (
              <span className="text-neutral-500 dark:text-neutral-400 ml-1">
                @ {formatWeight(set.targetWeight)}
              </span>
            )}
          </div>

          {/* RPE / Actual */}
          <div className="text-right">
            {isComplete ? (
              <div>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {set.actual?.reps} reps
                </span>
                <span className="text-neutral-500 ml-1">
                  @ {set.actual?.weight}kg
                </span>
              </div>
            ) : set.targetRpe ? (
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 text-xs block">
                  RPE
                </span>
                <span className="font-semibold">{set.targetRpe}/10</span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Action button */}
        {!isComplete && !isLogging && onLogSet && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLogging(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Play className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Logging form */}
      <AnimatePresence>
        {isLogging && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 mt-3 border-t border-neutral-200 dark:border-neutral-700">
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">
                    Reps
                  </label>
                  <Input
                    type="number"
                    value={logData.reps}
                    onChange={(e) =>
                      setLogData({ ...logData, reps: Number(e.target.value) })
                    }
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">
                    Weight (kg)
                  </label>
                  <Input
                    type="number"
                    value={logData.weight}
                    onChange={(e) =>
                      setLogData({ ...logData, weight: Number(e.target.value) })
                    }
                    className="h-9"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-500 block mb-1">
                    RPE
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={logData.rpe}
                    onChange={(e) =>
                      setLogData({ ...logData, rpe: Number(e.target.value) })
                    }
                    className="h-9"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsLogging(false)}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmitLog}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Log Set
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rest timer indicator */}
      {!isComplete && set.setNumber > 1 && (
        <div className="absolute -top-2 right-3 flex items-center gap-1 text-xs text-neutral-400 bg-white dark:bg-neutral-900 px-2 py-0.5 rounded-full border border-neutral-200 dark:border-neutral-700">
          <Clock className="w-3 h-3" />
          <span>Rest {formatRestTime(restTime)}</span>
        </div>
      )}
    </div>
  );
}

function CoachingTips({
  cues,
  mistakes,
}: {
  cues: string[];
  mistakes: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!cues.length && !mistakes.length) return null;

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        <Lightbulb className="w-4 h-4" />
        <span>Coaching Tips</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-3">
              {/* Form Cues */}
              {cues.length > 0 && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Form Cues
                  </h4>
                  <ul className="space-y-1">
                    {cues.map((cue, i) => (
                      <li
                        key={i}
                        className="text-sm text-blue-600 dark:text-blue-300 flex items-start gap-2"
                      >
                        <span className="text-blue-400">•</span>
                        {cue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Common Mistakes */}
              {mistakes.length > 0 && (
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                  <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Avoid These Mistakes
                  </h4>
                  <ul className="space-y-1">
                    {mistakes.map((mistake, i) => (
                      <li
                        key={i}
                        className="text-sm text-amber-600 dark:text-amber-300 flex items-start gap-2"
                      >
                        <span className="text-amber-400">•</span>
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AlternativeExercises({ alternatives }: { alternatives: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!alternatives.length) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
      >
        <RefreshCw className="w-4 h-4" />
        <span>{alternatives.length} alternatives</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-2 flex flex-wrap gap-2">
              {alternatives.map((alt, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  {alt}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ExerciseCard({
  exercise,
  dayId,
  onLogSet,
  compact = false,
}: ExerciseCardProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const progress = getExerciseProgress(exercise);
  const tempo = exercise.tempo ? parseTempo(exercise.tempo) : null;

  return (
    <motion.div
      layout
      className={`bg-white dark:bg-neutral-900 border rounded-2xl overflow-hidden transition-all ${
        progress.isComplete
          ? "border-emerald-300 dark:border-emerald-700"
          : "border-neutral-200 dark:border-neutral-800"
      }`}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-4 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
      >
        {/* Icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            progress.isComplete
              ? "bg-emerald-100 dark:bg-emerald-900/30"
              : "bg-neutral-100 dark:bg-neutral-800"
          }`}
        >
          {progress.isComplete ? (
            <Check className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Dumbbell className="w-6 h-6 text-neutral-500" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{exercise.name}</h3>
          <div className="flex items-center gap-2 text-sm text-neutral-500 mt-0.5">
            <span>
              {progress.completedSets}/{progress.totalSets} sets
            </span>
            <span>•</span>
            <span>Rest {formatRestTime(exercise.restBetweenSets)}</span>
            {tempo && (
              <>
                <span>•</span>
                <span>Tempo {exercise.tempo}</span>
              </>
            )}
          </div>
        </div>

        {/* Muscle groups */}
        <div className="hidden sm:flex gap-1">
          {exercise.muscleGroups.primary.slice(0, 2).map((mg) => (
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

        {/* Expand/Collapse */}
        <div className="text-neutral-400">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {/* Equipment & Muscle Groups */}
              <div className="flex flex-wrap gap-2 mb-4 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                {/* Equipment */}
                {exercise.equipment.map((eq) => (
                  <span
                    key={eq}
                    className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs text-neutral-600 dark:text-neutral-400"
                  >
                    {eq}
                  </span>
                ))}

                {/* Secondary muscles */}
                {exercise.muscleGroups.secondary.map((mg) => (
                  <span
                    key={mg}
                    className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-xs text-neutral-500"
                  >
                    {mg}
                  </span>
                ))}
              </div>

              {/* Sets */}
              <div className="space-y-2">
                {exercise.sets.map((set) => (
                  <SetRow
                    key={set.setNumber}
                    set={set}
                    exerciseId={exercise.id}
                    restTime={exercise.restBetweenSets}
                    onLogSet={onLogSet}
                  />
                ))}
              </div>

              {/* Notes */}
              {exercise.notes && (
                <div className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl flex items-start gap-2">
                  <Info className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {exercise.notes}
                  </p>
                </div>
              )}

              {/* Coaching Tips */}
              <CoachingTips
                cues={exercise.cues}
                mistakes={exercise.commonMistakes}
              />

              {/* Alternatives */}
              <AlternativeExercises alternatives={exercise.alternatives} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress bar */}
      {!isExpanded && progress.completedSets > 0 && (
        <div className="h-1 bg-neutral-100 dark:bg-neutral-800">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
            style={{
              width: `${(progress.completedSets / progress.totalSets) * 100}%`,
            }}
          />
        </div>
      )}
    </motion.div>
  );
}

export default ExerciseCard;

