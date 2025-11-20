"use client";

import { Calendar } from "@/components/ui/shadcn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/shadcn/popover";
import { useSession } from "@/lib/auth-client";
import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarIcon,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mars,
  Minus,
  User,
  Users,
  Venus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const MIN_BIRTH_YEAR = 1900;
const MIN_BIRTH_DATE = new Date(`${MIN_BIRTH_YEAR}-01-01`);

export function StepBasicProfile() {
  const { data, updateData, setStep } = useOnboardingStore();
  const { data: session } = useSession();

  const [name, setName] = useState(data.basicProfile.name);
  const [dob, setDob] = useState<Date | undefined>(
    data.basicProfile.dob ? new Date(data.basicProfile.dob) : undefined
  );
  const [gender, setGender] = useState(data.basicProfile.gender);
  const [age, setAge] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const today = new Date();
  const currentYear = today.getFullYear();
  const maxMonth = new Date(currentYear, today.getMonth(), 1);
  const minMonth = new Date(MIN_BIRTH_YEAR, 0, 1);

  const clampMonthToBounds = (date: Date) => {
    const normalized = new Date(date.getFullYear(), date.getMonth(), 1);
    if (normalized < minMonth) return minMonth;
    if (normalized > maxMonth) return maxMonth;
    return normalized;
  };

  const [visibleMonth, setVisibleMonth] = useState<Date>(() =>
    clampMonthToBounds(
      dob
        ? new Date(dob.getFullYear(), dob.getMonth(), 1)
        : new Date(currentYear - 25, today.getMonth(), 1)
    )
  );

  useEffect(() => {
    if (dob) {
      setVisibleMonth(new Date(dob.getFullYear(), dob.getMonth(), 1));
    }
  }, [dob]);

  const years = useMemo(
    () =>
      Array.from(
        { length: currentYear - MIN_BIRTH_YEAR + 1 },
        (_, index) => currentYear - index
      ),
    [currentYear]
  );

  // Pre-fill name from session if available and not already set
  useEffect(() => {
    if (session?.user?.name && !name) {
      setName(session.user.name);
      updateData("basicProfile", { name: session.user.name });
    }
  }, [session, name, updateData]);

  // Calculate age when DOB changes
  useEffect(() => {
    if (dob) {
      const today = new Date();
      let calculatedAge = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
    } else {
      setAge(null);
    }
  }, [dob]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (name.length < 2 || name.length > 50) {
      newErrors.name = "Name must be between 2 and 50 characters";
    }

    if (!dob) {
      newErrors.dob = "Date of birth is required";
    } else if (age !== null && age < 13) {
      newErrors.dob = "You must be at least 13 years old";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      updateData("basicProfile", {
        name,
        dob,
        gender,
      });
      setStep(2);
    }
  };

  const canGoPrevMonth = visibleMonth > minMonth;
  const canGoNextMonth = visibleMonth < maxMonth;

  const handleMonthStep = (delta: number) => {
    setVisibleMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(prev.getMonth() + delta);
      return clampMonthToBounds(next);
    });
  };

  const handleYearSelect = (year: number) => {
    setVisibleMonth((prev) => {
      const next = new Date(prev);
      next.setFullYear(year);
      return clampMonthToBounds(next);
    });
  };

  const handleMonthSelect = (monthIndex: number) => {
    setVisibleMonth((prev) => {
      const next = new Date(prev);
      next.setMonth(monthIndex);
      return clampMonthToBounds(next);
    });
  };

  const genderOptions = [
    { id: "male", label: "Male", icon: Mars },
    { id: "female", label: "Female", icon: Venus },
    { id: "other", label: "Other", icon: Users },
    { id: "skip", label: "Skip", icon: Minus },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          Basic Profile
        </h2>
        <p className="text-lg text-muted-foreground">
          Tell us a bit about yourself to personalize your experience.
        </p>
      </div>

      <div className="space-y-8">
        {/* Name Input */}
        <div className="space-y-2 group">
          <label
            htmlFor="name"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-3 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                "flex h-12 w-full rounded-xl border border-input bg-background/50 px-12 py-2 text-base shadow-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:bg-accent/20 hover:border-primary/30",
                errors.name &&
                  "border-destructive focus-visible:ring-destructive"
              )}
              placeholder="John Doe"
            />
          </div>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-sm text-destructive font-medium ml-1"
            >
              {errors.name}
            </motion.p>
          )}
        </div>

        {/* DOB Input */}
        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium leading-none">
            Date of Birth
          </label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                className={cn(
                  "flex h-12 w-full items-center justify-start text-left rounded-xl border border-input bg-background/50 px-4 py-2 text-base shadow-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:bg-accent/20 hover:border-primary/30",
                  !dob && "text-muted-foreground",
                  errors.dob &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                {dob ? format(dob, "PPP") : <span>Pick a date</span>}
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto border-none bg-transparent p-0 shadow-none"
              align="start"
              sideOffset={8}
            >
              <div className="rounded-2xl border bg-card shadow-2xl">
                <div className="flex flex-col gap-3 border-b border-border/50 px-4 pt-4 pb-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Select Month & Year
                  </span>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 gap-2">
                      <div className="relative flex-1">
                        <select
                          value={visibleMonth.getMonth()}
                          onChange={(event) =>
                            handleMonthSelect(Number(event.target.value))
                          }
                          className="w-full appearance-none rounded-xl border border-border bg-muted/20 px-3 py-2 pr-8 text-sm font-medium text-foreground shadow-inner transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                          {MONTH_LABELS.map((label, index) => (
                            <option key={label} value={index}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                      <div className="relative flex-1">
                        <select
                          value={visibleMonth.getFullYear()}
                          onChange={(event) =>
                            handleYearSelect(Number(event.target.value))
                          }
                          className="w-full appearance-none rounded-xl border border-border bg-muted/20 px-3 py-2 pr-8 text-sm font-medium text-foreground shadow-inner transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                        >
                          {years.map((yearOption) => (
                            <option key={yearOption} value={yearOption}>
                              {yearOption}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleMonthStep(-1)}
                        disabled={!canGoPrevMonth}
                        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground disabled:opacity-40"
                      >
                        <ChevronLeft className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMonthStep(1)}
                        disabled={!canGoNextMonth}
                        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:text-foreground disabled:opacity-40"
                      >
                        <ChevronRight className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <Calendar
                  mode="single"
                  selected={dob}
                  onSelect={(date) => {
                    setDob(date);
                    if (date) {
                      setVisibleMonth(
                        new Date(date.getFullYear(), date.getMonth(), 1)
                      );
                    }
                    setIsCalendarOpen(false);
                  }}
                  month={visibleMonth}
                  onMonthChange={(month) =>
                    setVisibleMonth(clampMonthToBounds(month))
                  }
                  disabled={(date) => date > today || date < MIN_BIRTH_DATE}
                  initialFocus
                  hideNavigation
                  className="!p-3"
                />
              </div>
            </PopoverContent>
          </Popover>
          <div className="flex justify-between items-center px-1">
            {errors.dob ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-destructive font-medium"
              >
                {errors.dob}
              </motion.p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Required for age calculation
              </p>
            )}
            {age !== null && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  "text-sm font-medium px-3 py-1 rounded-full border",
                  age >= 13
                    ? "bg-green-500/10 text-green-600 border-green-200 dark:border-green-900 dark:text-green-400"
                    : "bg-red-500/10 text-red-600 border-red-200 dark:border-red-900 dark:text-red-400"
                )}
              >
                {age} years old
              </motion.span>
            )}
          </div>
        </div>

        {/* Gender Selection */}
        <div className="space-y-4">
          <label className="text-sm font-medium leading-none">
            Gender (Optional)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {genderOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = gender === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setGender(option.id)}
                  className={cn(
                    "relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 hover:shadow-md group",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                      : "border-input bg-card hover:border-primary/50 hover:bg-accent/50"
                  )}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="gender-check"
                      className="absolute top-2 right-2 text-primary"
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                  <div
                    className={cn(
                      "p-3 rounded-full mb-3 transition-colors duration-300",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground group-hover:text-primary group-hover:bg-primary/10"
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isSelected
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-8 flex justify-end">
        <button
          onClick={handleContinue}
          className="group relative inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-xl transition-all hover:bg-primary/90 hover:shadow-primary/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-95"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
