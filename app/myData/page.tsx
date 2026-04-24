"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Calendar } from "@/components/ui/shadcn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { DailySummaryMeal, useDailySummary } from "@/lib/hooks/useDailySummary";
import {
  formatIstDateKey,
  getIstDateKey,
  isValidIstDateKey,
  shiftIstDateKey,
} from "@/lib/ist-time";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Droplets,
  Drumstick,
  Flame,
  Loader2,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Utensils,
  Wheat,
} from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";

const MEALS_PAGE_SIZE = 5;

function toDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function toDisplayTime(value: string | null): string {
  if (!value) {
    return "Time unavailable";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Time unavailable";
  }

  return `${new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(parsed)} IST`;
}

function buildInsights(
  meals: DailySummaryMeal[],
  totalProtein: number,
  totalCarbs: number,
  totalFat: number,
): string[] {
  if (!meals.length) {
    return [
      "No meals were logged for this day yet. Capture your next meal in Analyze to build your report.",
    ];
  }

  const insights: string[] = [];

  const highestCalorieMeal = meals.reduce((previous, current) =>
    current.calories > previous.calories ? current : previous,
  );

  insights.push(
    `Your highest-calorie meal was ${Math.round(highestCalorieMeal.calories)} kcal at ${toDisplayTime(highestCalorieMeal.loggedAtIst)}.`,
  );

  const macroCalories = {
    protein: totalProtein * 4,
    carbs: totalCarbs * 4,
    fat: totalFat * 9,
  };
  const [dominantMacro] = Object.entries(macroCalories).sort(
    (a, b) => b[1] - a[1],
  )[0];

  insights.push(
    `This day is ${dominantMacro}-dominant based on your macro calorie split.`,
  );

  const uniqueFoods = new Set(
    meals.flatMap((meal) =>
      meal.foodItems.map((item) => item.name.trim().toLowerCase()),
    ),
  );

  if (uniqueFoods.size > 0) {
    insights.push(
      `You logged ${uniqueFoods.size} distinct food items across ${meals.length} meals.`,
    );
  }

  const validTimes = meals
    .map((meal) => (meal.loggedAtIst ? new Date(meal.loggedAtIst) : null))
    .filter((value): value is Date => value !== null && !Number.isNaN(value.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  if (validTimes.length >= 2) {
    const spreadHours = (validTimes[validTimes.length - 1].getTime() - validTimes[0].getTime()) / (1000 * 60 * 60);
    insights.push(`Your eating window spans roughly ${spreadHours.toFixed(1)} hours.`);
  }

  return insights;
}

function StatCard({
  label,
  value,
  unit,
  icon: Icon,
}: {
  label: string;
  value: string;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-black/10 bg-white/50 p-5 shadow-sm backdrop-blur-md transition-all hover:border-black/20 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/30">
      <div className="absolute -right-6 -top-6 opacity-[0.03] transition-transform duration-500 group-hover:scale-110 group-hover:opacity-[0.05] dark:opacity-[0.02] dark:group-hover:opacity-[0.04]">
        <Icon className="size-32" />
      </div>
      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
            {label}
          </p>
          <Icon className="size-4 text-neutral-400 dark:text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors" />
        </div>
        <p className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tighter">{value}</span>
          <span className="text-sm font-mono text-neutral-500 dark:text-neutral-400">{unit}</span>
        </p>
      </div>
    </div>
  );
}

export default function MyDataPage() {
  const todayDateKey = useMemo(() => getIstDateKey(), []);
  const [selectedDate, setSelectedDate] = useState(todayDateKey);
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDailySummary(selectedDate, MEALS_PAGE_SIZE);

  const isTodaySelected = selectedDate === todayDateKey;
  const disableNextDay = selectedDate >= todayDateKey;
  const selectedCalendarDate = useMemo(() => {
    if (!isValidIstDateKey(selectedDate)) {
      return undefined;
    }

    return parseISO(`${selectedDate}T00:00:00`);
  }, [selectedDate]);

  const latestPage = data?.pages[0];
  const meals = useMemo(
    () => data?.pages.flatMap((page) => page.meals) ?? [],
    [data?.pages],
  );

  const insights = useMemo(() => {
    if (!latestPage) {
      return [];
    }

    return buildInsights(
      meals,
      latestPage.summary.totalProtein,
      latestPage.summary.totalCarbs,
      latestPage.summary.totalFat,
    );
  }, [latestPage, meals]);

  const calorieDelta = latestPage?.comparison.calorieDelta ?? 0;
  const hasHigherCaloriesThanYesterday = calorieDelta >= 0;

  return (
    <main className="relative min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-x-hidden font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Light Mode "Vapor" Background matching hero page */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-neutral-200/50 dark:bg-neutral-800/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-neutral-200/50 dark:bg-neutral-800/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neutral-100/30 dark:bg-neutral-900/20 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-block border border-black/20 dark:border-white/20 px-3 py-1 text-xs font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                Daily Nutrition Report
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
                MY DATA
              </h1>
              <p className="max-w-xl text-base text-neutral-600 dark:text-neutral-400">
                Review your meals, macro balance, and eating behavior for{" "}
                <span className="font-semibold text-black dark:text-white">
                  {formatIstDateKey(selectedDate, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                .
              </p>
            </div>
            {isFetching && !isLoading && (
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/50 px-3 py-1.5 text-xs font-mono font-medium text-neutral-600 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
                <Loader2 className="size-3.5 animate-spin" />
                SYNCING DATA
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-black/10 bg-white/50 p-2 backdrop-blur-md dark:border-white/10 dark:bg-white/5 w-fit">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-lg h-9 w-9 bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setSelectedDate((previous) => shiftIstDateKey(previous, -1))}
            >
              <ChevronLeft className="size-4" />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="min-w-[220px] justify-start gap-3 rounded-lg font-mono text-sm bg-transparent border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <CalendarDays className="size-4" />
                  {formatIstDateKey(selectedDate, {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).toUpperCase()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-xl border-black/10 dark:border-white/10 shadow-xl">
                <Calendar
                  mode="single"
                  selected={selectedCalendarDate}
                  onSelect={(date) => {
                    if (!date) {
                      return;
                    }
                    setSelectedDate(toDateKey(date));
                  }}
                  disabled={(date) => toDateKey(date) > todayDateKey}
                  className="font-sans"
                />
              </PopoverContent>
            </Popover>

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-lg h-9 w-9 bg-transparent border-transparent hover:bg-black/5 dark:hover:bg-white/10"
              onClick={() => setSelectedDate((previous) => shiftIstDateKey(previous, 1))}
              disabled={disableNextDay}
            >
              <ChevronRight className="size-4" />
            </Button>

            <div className="w-px h-5 bg-black/10 dark:bg-white/10 mx-1" />

            <Button
              type="button"
              variant="ghost"
              className={cn("rounded-lg px-4 h-9 font-mono text-xs uppercase tracking-wider", isTodaySelected ? "font-bold bg-black/5 dark:bg-white/10" : "hover:bg-black/5 dark:hover:bg-white/10")}
              disabled={isTodaySelected}
              onClick={() => setSelectedDate(todayDateKey)}
            >
              Today
            </Button>
          </div>
        </header>

        {isLoading ? (
          <motion.section 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5"
                />
              ))}
            </div>
            <div className="h-28 animate-pulse rounded-xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />
            <div className="h-64 animate-pulse rounded-xl border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />
          </motion.section>
        ) : isError ? (
          <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center backdrop-blur-md">
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">Unable to load your daily report.</p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              {error instanceof Error ? error.message : "Please try again."}
            </p>
            <Button onClick={() => refetch()} className="mt-6 rounded-lg font-mono uppercase tracking-widest text-xs" variant="outline">
              Retry Sync
            </Button>
          </section>
        ) : latestPage ? (
          <motion.section 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <StatCard
                label="Calories"
                value={Math.round(latestPage.summary.totalCalories).toString()}
                unit="KCAL"
                icon={Flame}
              />
              <StatCard
                label="Protein"
                value={latestPage.summary.totalProtein.toFixed(1)}
                unit="G"
                icon={Drumstick}
              />
              <StatCard
                label="Carbs"
                value={latestPage.summary.totalCarbs.toFixed(1)}
                unit="G"
                icon={Wheat}
              />
              <StatCard
                label="Fat"
                value={latestPage.summary.totalFat.toFixed(1)}
                unit="G"
                icon={Droplets}
              />
              <StatCard
                label="Entries"
                value={String(latestPage.summary.mealCount)}
                unit="MEALS"
                icon={Utensils}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6 rounded-xl border border-black/10 bg-white/50 p-6 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              <div>
                <p className="mb-2 text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  State Comparison
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Delta compared to{" "}
                  <span className="font-semibold text-black dark:text-white">
                    {formatIstDateKey(latestPage.comparison.previousDate)}
                  </span>
                  .
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-black/10 bg-white/80 px-4 py-3 text-sm font-mono shadow-sm dark:border-white/10 dark:bg-black/50">
                {hasHigherCaloriesThanYesterday ? (
                  <TrendingUp className="size-4 text-black dark:text-white" />
                ) : (
                  <TrendingDown className="size-4 text-black dark:text-white" />
                )}
                <span>
                  {hasHigherCaloriesThanYesterday ? "+" : ""}
                  {Math.round(calorieDelta)} KCAL VARIANCE
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
              <aside className="h-fit rounded-xl border border-black/10 bg-white/50 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10">
                    <Sparkles className="size-4 text-black dark:text-white" />
                  </div>
                  <h2 className="text-sm font-mono uppercase tracking-widest font-semibold">Engine Insights</h2>
                </div>
                <ul className="space-y-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {insights.map((insight, index) => (
                    <li key={`${insight}-${index}`} className="flex gap-4">
                      <div className="mt-2 size-1.5 shrink-0 rounded-full bg-black/20 dark:bg-white/20" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </aside>

              <div className="rounded-xl border border-black/10 bg-white/50 p-6 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-6 dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10">
                      <Clock3 className="size-4 text-black dark:text-white" />
                    </div>
                    <h2 className="text-sm font-mono uppercase tracking-widest font-semibold">Timeline Log</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex size-6 items-center justify-center rounded-md bg-black text-xs font-mono font-medium text-white dark:bg-white dark:text-black">
                      {meals.length}
                    </span>
                    <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                      / {latestPage.summary.mealCount} entries
                    </span>
                  </div>
                </div>

                {meals.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-black/20 bg-black/5 p-12 text-center dark:border-white/20 dark:bg-white/5">
                    <Utensils className="mx-auto mb-4 size-8 text-neutral-400 dark:text-neutral-600" />
                    <p className="font-mono text-sm uppercase tracking-widest font-semibold mb-2">Awaiting Data</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                      No meals tracked for this cycle. Capture a meal to initialize the reporting sequence.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {meals.map((meal) => (
                      <article
                        key={meal.id}
                        className="group relative overflow-hidden rounded-xl border border-black/10 bg-white/80 transition-all hover:border-black/20 hover:shadow-md dark:border-white/10 dark:bg-black/50 dark:hover:border-white/20"
                      >
                        <div className="grid grid-cols-1 gap-0 sm:grid-cols-[220px_minmax(0,1fr)]">
                          <div className="relative h-56 sm:h-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                            <Image
                              src={meal.imageUrl}
                              alt="Logged meal"
                              fill
                              sizes="(max-width: 640px) 100vw, 220px"
                              className="object-cover transition-transform duration-700 group-hover:scale-105"
                              loading="lazy"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent sm:bg-gradient-to-r" />
                          </div>

                          <div className="flex flex-col justify-between p-6">
                            <div>
                              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                                  <Clock3 className="size-3.5" />
                                  {toDisplayTime(meal.loggedAtIst)}
                                </div>
                                <span className="inline-flex items-center rounded-md bg-black/5 px-3 py-1 text-xs font-mono font-semibold dark:bg-white/10">
                                  {Math.round(meal.calories)} KCAL
                                </span>
                              </div>

                              {meal.foodItems.length > 0 ? (
                                <ul className="mb-8 space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
                                  {meal.foodItems.map((item, index) => (
                                    <li
                                      key={`${meal.id}-${item.name}-${index}`}
                                      className="flex items-start justify-between gap-4"
                                    >
                                      <div className="flex gap-3">
                                        <span className="font-mono text-neutral-400 dark:text-neutral-500">{item.quantity}x</span>
                                        <div>
                                          <p className="font-medium text-black dark:text-white leading-tight">{item.name}</p>
                                          <p className="text-xs text-neutral-500 mt-1">{item.portion}</p>
                                        </div>
                                      </div>
                                      <span className="font-mono text-xs text-neutral-500 shrink-0">
                                        {Math.round(item.calories)} KCAL
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="mb-8 text-sm text-neutral-500 italic">
                                  No structural breakdown available.
                                </p>
                              )}
                            </div>

                            <div className="grid grid-cols-3 gap-4 border-t border-black/10 pt-4 dark:border-white/10">
                              <div className="space-y-1.5">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Protein</p>
                                <p className="font-mono text-sm font-semibold">{meal.protein.toFixed(1)}G</p>
                              </div>
                              <div className="space-y-1.5">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Carbs</p>
                                <p className="font-mono text-sm font-semibold">{meal.carbs.toFixed(1)}G</p>
                              </div>
                              <div className="space-y-1.5">
                                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Fat</p>
                                <p className="font-mono text-sm font-semibold">{meal.fat.toFixed(1)}G</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                    {hasNextPage && (
                      <div className="pt-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full rounded-lg font-mono text-xs uppercase tracking-widest"
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                        >
                          {isFetchingNextPage ? "Loading..." : "Load older entries"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        ) : null}
      </div>
    </main>
  );
}