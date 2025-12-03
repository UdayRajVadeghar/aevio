"use client";

import { Button } from "@/components/ui/shadcn/button";
import { mockWorkoutPlan } from "@/lib/mock/workout-plan-mock";
import { WorkoutDay, WorkoutPlan } from "@/lib/types/workout";
import { cn } from "@/lib/utils";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  Clock,
  Dumbbell,
  Info,
  Lightbulb,
  RefreshCw,
  Target,
  TriangleAlert,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

// ============================================================================
// Brutalist Components
// ============================================================================

const BrutalistCard = ({
  children,
  className,
  rotation = 0,
  color = "bg-white",
  borderColor = "border-black",
}: {
  children: React.ReactNode;
  className?: string;
  rotation?: number;
  color?: string;
  borderColor?: string;
}) => (
  <div
    className={cn(
      "relative border-[3px] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
      color,
      borderColor,
      className
    )}
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    {children}
  </div>
);

const Sticker = ({
  text,
  color = "bg-yellow-400",
  rotation = -2,
  className,
}: {
  text: string;
  color?: string;
  rotation?: number;
  className?: string;
}) => (
  <div
    className={cn(
      "inline-block px-3 py-1 text-xs font-sans font-black border-2 border-black text-black uppercase tracking-tighter shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      color,
      className
    )}
    style={{ transform: `rotate(${rotation}deg)` }}
  >
    {text}
  </div>
);

// ============================================================================
// Main Page Component
// ============================================================================

// Helper type for calendar day info
interface CalendarDayInfo {
  workoutDay: WorkoutDay | null;
  isInSchedule: boolean;
  isBeforeSchedule: boolean;
  isAfterSchedule: boolean;
  isImplicitRestDay: boolean; // Rest day not in JSON but part of the week
}

export default function WorkoutPlanViewPage() {
  const [plan] = useState<WorkoutPlan>(mockWorkoutPlan);

  // Parse the plan's generatedAt date to use as start date
  const planStartDate = useMemo(() => {
    return startOfDay(parseISO(plan.generatedAt));
  }, [plan.generatedAt]);

  // Calculate total weeks in the plan
  const totalWeeks = useMemo(() => {
    let count = 0;
    plan.phases.forEach((phase) => {
      count += phase.weeks.length;
    });
    return count;
  }, [plan.phases]);

  // Calculate plan end date (each week = 7 calendar days)
  const planEndDate = useMemo(() => {
    return addDays(planStartDate, totalWeeks * 7 - 1);
  }, [planStartDate, totalWeeks]);

  // Initialize currentMonth to the month when plan starts
  const [currentMonth, setCurrentMonth] = useState(() => planStartDate);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Default to today if within schedule, otherwise plan start
    const today = new Date();
    if (!isBefore(today, planStartDate) && !isAfter(today, planEndDate)) {
      return today;
    }
    return planStartDate;
  });
  
  // Track which block is expanded (null = none expanded)
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null);

  // Format rest time to readable string
  const formatRestTime = (seconds: number): string => {
    if (seconds === 0) return "No rest";
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  };

  // Format muscle group name (snake_case to Title Case)
  const formatMuscleGroup = (muscle: string): string => {
    return muscle
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get set type badge color
  const getSetTypeBadge = (type: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      warmup: { bg: "bg-amber-200", text: "text-amber-800" },
      working: { bg: "bg-blue-200", text: "text-blue-800" },
      dropset: { bg: "bg-purple-200", text: "text-purple-800" },
      failure: { bg: "bg-red-200", text: "text-red-800" },
      backoff: { bg: "bg-green-200", text: "text-green-800" },
    };
    return colors[type] || { bg: "bg-neutral-200", text: "text-neutral-800" };
  };

  // Toggle block expansion
  const toggleBlock = (blockId: string) => {
    setExpandedBlockId((prev) => (prev === blockId ? null : blockId));
  };

  // Determine the active phase (using first phase for demo)
  const activePhase = plan.phases[0];

  // Map plan days to actual calendar dates based on generatedAt
  // Each week spans 7 calendar days, with workout days mapped by dayNumber (1-7)
  // Days not in JSON but within a week's 7-day span are implicit rest days
  const workoutDaysMap = useMemo(() => {
    const map = new Map<string, WorkoutDay>();

    let weekCounter = 0;
    plan.phases.forEach((phase) => {
      phase.weeks.forEach((week) => {
        // Each week starts at weekCounter * 7 days from plan start
        const weekStartDate = addDays(planStartDate, weekCounter * 7);

        // Map each day in this week by its dayNumber (1-based)
        week.days.forEach((day) => {
          // dayNumber is 1-7, so we subtract 1 to get 0-based offset
          const date = addDays(weekStartDate, day.dayNumber - 1);
          const dateKey = format(date, "yyyy-MM-dd");
          map.set(dateKey, day);
        });

        weekCounter++;
      });
    });
    return map;
  }, [plan.phases, planStartDate]);

  // Get info about a specific calendar day
  const getCalendarDayInfo = (day: Date): CalendarDayInfo => {
    const dateKey = format(day, "yyyy-MM-dd");
    const workoutDay = workoutDaysMap.get(dateKey) || null;
    const dayStart = startOfDay(day);

    const isBeforeSchedule = isBefore(dayStart, planStartDate);
    const isAfterSchedule = isAfter(dayStart, planEndDate);

    // Check if this day is within the schedule period but has no workout (implicit rest)
    const isWithinSchedulePeriod = !isBeforeSchedule && !isAfterSchedule;
    const isImplicitRestDay = isWithinSchedulePeriod && workoutDay === null;

    return {
      workoutDay,
      isInSchedule: isWithinSchedulePeriod,
      isBeforeSchedule,
      isAfterSchedule,
      isImplicitRestDay,
    };
  };

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        days.push(day);
        day = addDays(day, 1);
      }
      rows.push(days);
      days = [];
    }
    return rows;
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(addDays(currentMonth, 30));
  const prevMonth = () => setCurrentMonth(addDays(currentMonth, -30));

  const selectedDayInfo = getCalendarDayInfo(selectedDate);
  const selectedWorkoutDay = selectedDayInfo.workoutDay;

  return (
    <main className="min-h-screen bg-[#f2f0e9] text-black font-mono overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      {/* Background Grid Pattern */}
      <div
        className="fixed inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="relative z-10 max-w-md mx-auto md:max-w-4xl min-h-screen flex flex-col">
        {/* Header Section */}
        <header className="p-6 pt-12 pb-2 flex justify-between items-end relative">
          <div className="relative z-20">
            <div className="flex gap-2 mb-2 flex-wrap">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="inline-block bg-black text-white px-4 py-1 text-sm font-bold border-2 border-black transform -rotate-1"
              >
                PHASE 1: {activePhase?.name.split(" ")[0]}
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-block bg-yellow-400 text-black px-3 py-1 text-xs font-bold border-2 border-black transform rotate-1"
              >
                {format(planStartDate, "MMM d")} →{" "}
                {format(planEndDate, "MMM d")}
              </motion.div>
            </div>
            <h1 className="text-6xl font-sans font-black tracking-tighter leading-[0.8] uppercase">
              {format(currentMonth, "MMMM")}
              <br />
              <span
                className="text-outline-black text-transparent stroke-black stroke-2"
                style={{ WebkitTextStroke: "2px black" }}
              >
                {format(currentMonth, "yyyy")}
              </span>
            </h1>
          </div>

          {/* Mini Nav */}
          <div className="flex gap-2 mb-2">
            <button
              onClick={prevMonth}
              className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all hover:-rotate-3"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all hover:rotate-3"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Decorative element */}
          <div className="absolute top-10 right-10 w-24 h-24 border-4 border-yellow-400 rounded-full z-0 opacity-50 blur-sm animate-pulse" />
        </header>

        {/* Calendar Grid */}
        <div className="px-4 py-4">
          <div className="bg-white border-2 border-black p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-2 border-b-2 border-black pb-2">
              {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                <div key={i} className="text-center font-black text-lg">
                  {d}
                </div>
              ))}
            </div>

            {/* Days */}
            {calendarDays.map((week, i) => (
              <div key={i} className="grid grid-cols-7">
                {week.map((day, j) => {
                  const dayInfo = getCalendarDayInfo(day);
                  const { workoutDay, isInSchedule, isImplicitRestDay } =
                    dayInfo;
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isTodayDate = isToday(day);
                  const isOutOfSchedule = !isInSchedule && isCurrentMonth;

                  // Check if it's any kind of rest day (explicit or implicit)
                  const isRestDay = workoutDay?.restDay || isImplicitRestDay;

                  return (
                    <div
                      key={j}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        "aspect-square border-r border-b border-neutral-200 relative p-1 cursor-pointer transition-colors",
                        isSelected && "bg-black text-white !border-black z-10",
                        !isCurrentMonth && "opacity-20 bg-neutral-100",
                        isOutOfSchedule && "bg-neutral-50 opacity-40",
                        isInSchedule && !isSelected && "hover:bg-neutral-100"
                      )}
                    >
                      <span
                        className={cn(
                          "text-sm font-bold block leading-none",
                          isTodayDate &&
                            !isSelected &&
                            "bg-yellow-400 inline-block px-1 border border-black rounded-sm"
                        )}
                      >
                        {format(day, "d")}
                      </span>

                      {/* Workout Indicator Blocks - only for scheduled workout days */}
                      {isInSchedule &&
                        workoutDay &&
                        !workoutDay.restDay &&
                        isCurrentMonth && (
                          <div className="absolute bottom-1 right-1 left-1 flex flex-col gap-0.5">
                            <div
                              className={cn(
                                "h-3 w-full border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]",
                                isSelected
                                  ? "bg-white border-white shadow-none"
                                  : "bg-blue-500"
                              )}
                            />
                            {/* Heavy day dot - multiple blocks */}
                            {workoutDay.blocks.length > 1 && (
                              <div
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full border border-black",
                                  isSelected
                                    ? "bg-white border-none"
                                    : "bg-red-500"
                                )}
                              />
                            )}
                          </div>
                        )}

                      {/* Rest Day Indicator - for explicit rest days in JSON */}
                      {isInSchedule &&
                        workoutDay &&
                        workoutDay.restDay &&
                        isCurrentMonth && (
                          <div className="absolute bottom-1 right-1 text-[10px] font-bold rotate-[-10deg] opacity-50">
                            REST
                          </div>
                        )}

                      {/* Implicit Rest Day Indicator - weekends/off days not in JSON */}
                      {isInSchedule && isImplicitRestDay && isCurrentMonth && (
                        <div className="absolute bottom-1 right-1 left-1 flex justify-center">
                          <div
                            className={cn(
                              "text-[8px] font-bold px-1 py-0.5 bg-green-200 border border-black rotate-[-3deg]",
                              isSelected && "bg-white text-black"
                            )}
                          >
                            OFF
                          </div>
                        </div>
                      )}

                      {/* Not in schedule indicator */}
                      {isOutOfSchedule && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-[1px] bg-neutral-300 rotate-45 absolute" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Day Detail View (The "Chaos" List) */}
        <div className="flex-1 px-4 pb-12 mt-8 relative">
          {/* Decorative tape */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-red-500/20 -rotate-2 transform skew-x-12" />

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-sans font-black uppercase italic">
              Daily Briefing
            </h2>
            <div className="text-sm font-bold border-b-2 border-black">
              {format(selectedDate, "EEEE, MMM do")}
            </div>
          </div>

          {selectedWorkoutDay ? (
            <div className="space-y-8">
              {/* Header Card */}
              <BrutalistCard rotation={1} className="bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      {selectedWorkoutDay.restDay ? (
                        <Sticker text="Rest & Recovery" color="bg-green-400" />
                      ) : (
                        <Sticker text="Workout Session" color="bg-orange-500" />
                      )}
                      <span className="text-xs font-bold border border-black px-2 py-1 rounded-full bg-white">
                        {selectedWorkoutDay.targetDuration} MIN
                      </span>
                    </div>
                    <h3 className="text-2xl font-black uppercase leading-tight">
                      {selectedWorkoutDay.name}
                    </h3>
                  </div>
                  <div className="text-4xl">
                    {selectedWorkoutDay.restDay ? "💤" : "🔥"}
                  </div>
                </div>
              </BrutalistCard>

              {/* Workout Blocks List */}
              {!selectedWorkoutDay.restDay && (
                <div className="pl-4 border-l-4 border-black space-y-6">
                  {selectedWorkoutDay.blocks.map((block, idx) => {
                    const isExpanded = expandedBlockId === block.id;
                    
                    return (
                      <div key={block.id} className="relative">
                        {/* Connector line decoration */}
                        <div className="absolute -left-[22px] top-4 w-4 h-4 bg-black rounded-full border-2 border-white" />

                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => toggleBlock(block.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleBlock(block.id);
                            }
                          }}
                          className={cn(
                            "bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5",
                            idx % 2 === 0 ? "-rotate-1" : "rotate-1",
                            isExpanded && "rotate-0 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                          )}
                        >
                          <div className="flex justify-between items-center mb-3 border-b-2 border-neutral-100 pb-2">
                            <span className="font-bold bg-black text-white px-2 py-0.5 text-xs">
                              BLOCK {idx + 1}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs uppercase">
                                {block.type}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </div>
                          </div>

                          {/* Collapsed View - Exercise Summary */}
                          {!isExpanded && (
                            <div className="space-y-3">
                              {block.exercises.map((ex) => (
                                <div
                                  key={ex.id}
                                  className="flex items-start gap-3 group"
                                >
                                  <div className="mt-1 min-w-[20px] h-[20px] bg-neutral-200 border-2 border-black flex items-center justify-center text-[10px] font-bold group-hover:bg-yellow-400 transition-colors">
                                    {ex.sets.length}
                                  </div>
                                  <div>
                                    <p className="font-bold leading-tight">
                                      {ex.name}
                                    </p>
                                    <p className="text-xs text-neutral-500 font-mono mt-0.5">
                                      {ex.sets[0].targetReps} reps @{" "}
                                      {ex.sets[0].targetRpe
                                        ? `RPE ${ex.sets[0].targetRpe}`
                                        : "Bodyweight"}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Expanded View - Full Exercise Details */}
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-6"
                            >
                              {/* Block Info */}
                              {(block.rounds || block.restBetweenRounds) && (
                                <div className="flex gap-3 flex-wrap text-xs">
                                  {block.rounds && (
                                    <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 border border-purple-300">
                                      <RefreshCw className="w-3 h-3" />
                                      <span className="font-bold">{block.rounds} rounds</span>
                                    </div>
                                  )}
                                  {block.restBetweenRounds && (
                                    <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 border border-blue-300">
                                      <Clock className="w-3 h-3" />
                                      <span className="font-bold">{formatRestTime(block.restBetweenRounds)} between rounds</span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Exercises */}
                              {block.exercises.map((ex, exIdx) => (
                                <div
                                  key={ex.id}
                                  className={cn(
                                    "border-2 border-neutral-200 p-4 bg-neutral-50",
                                    exIdx % 2 === 0 ? "rotate-0.5" : "-rotate-0.5"
                                  )}
                                >
                                  {/* Exercise Header */}
                                  <div className="flex items-start justify-between gap-2 mb-4">
                                    <div>
                                      <h4 className="font-black text-lg leading-tight">
                                        {ex.name}
                                      </h4>
                                      {/* Equipment */}
                                      {ex.equipment.length > 0 && (
                                        <div className="flex items-center gap-1.5 mt-1 text-xs text-neutral-600">
                                          <Dumbbell className="w-3 h-3" />
                                          <span>{ex.equipment.join(", ")}</span>
                                        </div>
                                      )}
                                    </div>
                                    {/* Rest Between Sets */}
                                    <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 text-xs border border-blue-300 shrink-0">
                                      <Clock className="w-3 h-3" />
                                      <span className="font-bold">{formatRestTime(ex.restBetweenSets)}</span>
                                    </div>
                                  </div>

                                  {/* Muscle Groups */}
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {ex.muscleGroups.primary.map((muscle) => (
                                      <span
                                        key={muscle}
                                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-red-200 border border-red-400 font-bold"
                                      >
                                        <Target className="w-3 h-3" />
                                        {formatMuscleGroup(muscle)}
                                      </span>
                                    ))}
                                    {ex.muscleGroups.secondary.map((muscle) => (
                                      <span
                                        key={muscle}
                                        className="inline-flex text-xs px-2 py-0.5 bg-neutral-200 border border-neutral-400"
                                      >
                                        {formatMuscleGroup(muscle)}
                                      </span>
                                    ))}
                                  </div>

                                  {/* Sets Table */}
                                  <div className="border-2 border-black mb-4">
                                    <div className="grid grid-cols-4 gap-2 bg-black text-white text-xs font-bold p-2">
                                      <span>SET</span>
                                      <span>TYPE</span>
                                      <span>REPS</span>
                                      <span>WEIGHT/RPE</span>
                                    </div>
                                    {ex.sets.map((set) => {
                                      const badge = getSetTypeBadge(set.type);
                                      return (
                                        <div
                                          key={set.setNumber}
                                          className="grid grid-cols-4 gap-2 text-xs p-2 border-t border-neutral-200 items-center"
                                        >
                                          <span className="font-bold">{set.setNumber}</span>
                                          <span
                                            className={cn(
                                              "px-1.5 py-0.5 text-center uppercase font-bold text-[10px]",
                                              badge.bg,
                                              badge.text
                                            )}
                                          >
                                            {set.type}
                                          </span>
                                          <span className="font-mono">{set.targetReps}</span>
                                          <span className="font-mono">
                                            {set.targetWeight
                                              ? `${set.targetWeight}kg`
                                              : set.targetRpe
                                              ? `RPE ${set.targetRpe}`
                                              : "BW"}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* Form Cues */}
                                  {ex.cues.length > 0 && (
                                    <div className="mb-3">
                                      <div className="flex items-center gap-1.5 text-xs font-bold text-green-700 mb-1.5">
                                        <Lightbulb className="w-3 h-3" />
                                        <span>FORM CUES</span>
                                      </div>
                                      <ul className="space-y-1">
                                        {ex.cues.map((cue, i) => (
                                          <li
                                            key={i}
                                            className="text-xs text-neutral-700 flex items-start gap-2"
                                          >
                                            <span className="text-green-600 mt-0.5">✓</span>
                                            {cue}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Common Mistakes */}
                                  {ex.commonMistakes.length > 0 && (
                                    <div className="mb-3">
                                      <div className="flex items-center gap-1.5 text-xs font-bold text-red-700 mb-1.5">
                                        <TriangleAlert className="w-3 h-3" />
                                        <span>AVOID</span>
                                      </div>
                                      <ul className="space-y-1">
                                        {ex.commonMistakes.map((mistake, i) => (
                                          <li
                                            key={i}
                                            className="text-xs text-neutral-700 flex items-start gap-2"
                                          >
                                            <span className="text-red-500 mt-0.5">✗</span>
                                            {mistake}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {/* Alternatives */}
                                  {ex.alternatives.length > 0 && (
                                    <div className="pt-2 border-t border-neutral-200">
                                      <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600 mb-1.5">
                                        <RefreshCw className="w-3 h-3" />
                                        <span>ALTERNATIVES</span>
                                      </div>
                                      <div className="flex flex-wrap gap-1.5">
                                        {ex.alternatives.map((alt, i) => (
                                          <span
                                            key={i}
                                            className="text-xs px-2 py-0.5 bg-yellow-100 border border-yellow-400"
                                          >
                                            {alt}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Notes */}
                                  {ex.notes && (
                                    <div className="mt-3 p-2 bg-amber-50 border border-amber-200 text-xs text-amber-800">
                                      <strong>Note:</strong> {ex.notes}
                                    </div>
                                  )}

                                  {/* Video URL */}
                                  {ex.videoUrl && (
                                    <a
                                      href={ex.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="inline-flex items-center gap-1.5 mt-3 text-xs text-blue-600 hover:underline"
                                    >
                                      🎬 Watch tutorial video
                                    </a>
                                  )}
                                </div>
                              ))}

                              {/* Tap to collapse hint */}
                              <p className="text-center text-xs text-neutral-400 mt-2">
                                Tap to collapse
                              </p>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedWorkoutDay.restDay && (
                <div className="p-8 text-center border-2 border-dashed border-black rounded-3xl bg-white/50 rotate-1">
                  <p className="font-black text-xl mb-2">TAKE IT EASY</p>
                  <p className="font-mono text-sm text-neutral-600">
                    Recovery is when the growth happens. Drink water, eat well,
                    and sleep.
                  </p>
                </div>
              )}

              <div className="pt-4 flex justify-center">
                <Button className="w-full bg-black text-white border-2 border-transparent hover:bg-white hover:text-black hover:border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 font-bold py-6 text-lg rounded-none uppercase tracking-widest">
                  {selectedWorkoutDay.restDay
                    ? "Mark Complete"
                    : "Start Workout"}
                </Button>
              </div>
            </div>
          ) : selectedDayInfo.isImplicitRestDay ? (
            // Implicit rest day (weekend/off day not in JSON)
            <div className="space-y-8">
              <BrutalistCard rotation={-1} className="bg-green-100">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex gap-2 mb-2 flex-wrap">
                      <Sticker
                        text="Day Off"
                        color="bg-green-400"
                        rotation={2}
                      />
                    </div>
                    <h3 className="text-2xl font-black uppercase leading-tight">
                      Rest Day
                    </h3>
                  </div>
                  <div className="text-4xl">🌿</div>
                </div>
              </BrutalistCard>

              <div className="p-8 text-center border-2 border-dashed border-green-600 rounded-3xl bg-green-50 -rotate-1">
                <p className="font-black text-xl mb-2">NO WORKOUT SCHEDULED</p>
                <p className="font-mono text-sm text-neutral-600">
                  This is your scheduled day off. Rest, recover, and come back
                  stronger!
                </p>
              </div>

              <div className="pt-4 flex justify-center">
                <Button className="w-full bg-green-600 text-white border-2 border-transparent hover:bg-white hover:text-green-600 hover:border-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 font-bold py-6 text-lg rounded-none uppercase tracking-widest">
                  Log Activity (Optional)
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {selectedDayInfo.isBeforeSchedule ? (
                <>
                  <p className="font-bold text-neutral-600 mb-2">
                    📅 Schedule hasn&apos;t started yet
                  </p>
                  <p className="text-sm text-neutral-400 font-mono">
                    Your plan starts on {format(planStartDate, "MMMM do, yyyy")}
                  </p>
                </>
              ) : selectedDayInfo.isAfterSchedule ? (
                <>
                  <p className="font-bold text-neutral-600 mb-2">
                    🏁 Schedule completed!
                  </p>
                  <p className="text-sm text-neutral-400 font-mono">
                    Your {plan.durationWeeks}-week plan ended on{" "}
                    {format(planEndDate, "MMMM do")}
                  </p>
                  <Button
                    variant="link"
                    className="mt-2 text-black font-black underline"
                  >
                    Generate New Plan
                  </Button>
                </>
              ) : (
                <>
                  <p className="font-bold text-neutral-400">
                    No workout planned for this day.
                  </p>
                  <Button
                    variant="link"
                    className="mt-2 text-black font-black underline"
                  >
                    Add Rest Day
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation Overlay */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white border-2 border-black p-2 rounded-full shadow-[0px_4px_20px_rgba(0,0,0,0.2)]">
          <Link href="/planner">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-neutral-100"
            >
              <CalendarIcon className="w-5 h-5" />
            </Button>
          </Link>
          <div className="w-px h-6 bg-neutral-200" />
          <Link href="/planner/workout/generate">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-neutral-100 text-orange-500"
            >
              <Zap className="w-5 h-5 fill-current" />
            </Button>
          </Link>
          <div className="w-px h-6 bg-neutral-200" />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-neutral-100"
          >
            <Info className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </main>
  );
}
