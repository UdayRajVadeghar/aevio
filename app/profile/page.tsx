"use client";

import { Button } from "@/components/ui/shadcn/button";
import { useSession } from "@/lib/auth-client";
import { useProfile } from "@/lib/hooks/useProfile";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Activity,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Edit2,
  Heart,
  Loader2,
  Ruler,
  Sparkles,
  Target,
  Trophy,
  User,
  Utensils,
  Weight,
  Zap,
} from "lucide-react";
import React from "react";

export default function ProfilePage() {
  const { data: session, isPending: isSessionPending } = useSession();
  const userId = session?.user?.id;

  const {
    data: userData,
    isLoading: isProfileLoading,
    error,
  } = useProfile(userId || "");

  const isLoading = isSessionPending || isProfileLoading;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background/50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
            <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
          </div>
          <p className="text-muted-foreground animate-pulse font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-card rounded-2xl border shadow-lg p-8 text-center"
        >
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <Heart className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Unable to Load Profile
          </h2>
          <p className="text-muted-foreground mb-8">
            We encountered an issue retrieving your data. Please check your
            connection and try again.
          </p>
          <Button
            size="lg"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Retry Connection
          </Button>
        </motion.div>
      </div>
    );
  }

  // No data state
  if (!userData) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-card rounded-2xl border shadow-lg p-8 text-center"
        >
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <User className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Welcome to Aevio
          </h2>
          <p className="text-muted-foreground mb-8">
            Your profile is waiting to be set up. Complete the onboarding to
            unlock your personalized dashboard.
          </p>
          <Button size="lg" className="w-full gap-2">
            Start Onboarding <Sparkles className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-background/50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-6xl mx-auto space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-3xl -z-10" />
          <div className="bg-card/50 backdrop-blur-sm rounded-3xl border shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-gradient-to-br from-primary to-primary/60 p-1 shadow-lg">
                  <div className="h-full w-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                    <User className="h-12 w-12 md:h-14 md:w-14 text-primary/80" />
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-background flex items-center justify-center border shadow-sm">
                  <Crown className="h-4 w-4 text-yellow-500" />
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                    {userData.basicProfile.name}
                  </h1>
                  <p className="text-muted-foreground flex items-center gap-2 text-sm md:text-base">
                    Member since {new Date().getFullYear()}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {userData.basicProfile.dob && (
                    <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full border border-border/50">
                      <Calendar className="h-3.5 w-3.5" />
                      {userData.basicProfile.dob.toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  )}
                  {userData.basicProfile.gender && (
                    <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1 rounded-full border border-border/50">
                      <User className="h-3.5 w-3.5" />
                      {userData.basicProfile.gender}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="group transition-all duration-300"
              size="lg"
            >
              <Edit2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Edit Profile
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* 30 Day Goal - Featured Card */}
            <motion.div variants={itemVariants}>
              <div className="bg-gradient-to-br from-primary/10 via-background to-background rounded-2xl border border-primary/20 p-1 shadow-sm">
                <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-500">
                      <Trophy className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium text-lg">Current Focus</h3>
                  </div>
                  <div className="relative">
                    <span className="absolute -top-4 -left-2 text-6xl font-serif text-primary/5 select-none">
                      &ldquo;
                    </span>
                    <p className="text-xl md:text-2xl font-normal text-foreground leading-relaxed relative z-10 pl-4">
                      {userData.goal}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Target date: 30 days remaining</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-4"
            >
              {userData.healthWellness.height && (
                <StatCard
                  icon={
                    <Ruler className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                  }
                  label="Height"
                  value={`${userData.healthWellness.height} cm`}
                  delay={0.1}
                />
              )}
              {userData.healthWellness.weight && (
                <StatCard
                  icon={
                    <Weight className="h-5 w-5 text-purple-600 dark:text-purple-500" />
                  }
                  label="Weight"
                  value={`${userData.healthWellness.weight} kg`}
                  delay={0.2}
                />
              )}
              {userData.healthWellness.activityLevel && (
                <StatCard
                  icon={
                    <Activity className="h-5 w-5 text-green-600 dark:text-green-500" />
                  }
                  label="Activity"
                  value={userData.healthWellness.activityLevel}
                  className="col-span-2 sm:col-span-1"
                  delay={0.3}
                />
              )}
              {userData.healthWellness.primaryGoal && (
                <StatCard
                  icon={
                    <Target className="h-5 w-5 text-orange-600 dark:text-orange-500" />
                  }
                  label="Goal Type"
                  value={userData.healthWellness.primaryGoal}
                  className="col-span-2 sm:col-span-1"
                  delay={0.4}
                />
              )}
              {userData.healthWellness.dietaryPreference && (
                <div className="col-span-2">
                  <StatCard
                    icon={
                      <Utensils className="h-5 w-5 text-rose-600 dark:text-rose-500" />
                    }
                    label="Dietary Preference"
                    value={userData.healthWellness.dietaryPreference}
                    delay={0.5}
                  />
                </div>
              )}
            </motion.div>

            {/* Habits Section */}
            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden">
                <CardHeader
                  icon={<Zap className="h-5 w-5 text-amber-500" />}
                  title="Active Habits"
                  action={
                    <Button variant="ghost" size="sm" className="text-xs">
                      View All
                    </Button>
                  }
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                  {userData.habits.map((habit, index) => (
                    <div
                      key={index}
                      className={cn(
                        "group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
                        habit.enabled
                          ? "bg-card hover:border-primary/30 hover:shadow-md"
                          : "bg-muted/30 border-transparent opacity-60 grayscale"
                      )}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm group-hover:text-primary transition-colors">
                          {habit.name}
                        </span>
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full w-fit">
                          {habit.type}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-semibold tracking-tight">
                          {habit.target}
                        </span>
                        <span className="text-xs text-muted-foreground font-normal uppercase">
                          {habit.unit}
                        </span>
                      </div>
                      {habit.enabled && (
                        <div className="absolute inset-0 border-2 border-primary/0 rounded-xl group-hover:border-primary/10 pointer-events-none transition-all" />
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <motion.div variants={itemVariants}>
              <div className="bg-card rounded-2xl border p-6 shadow-sm relative overflow-hidden">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                  Profile Strength
                </h3>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-4xl font-semibold text-primary tracking-tight">
                    85%
                  </span>
                  <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-md mb-1">
                    Almost there!
                  </span>
                </div>
                <div className="w-full bg-muted/50 h-3 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-slate-600 to-slate-500 dark:from-slate-400 dark:to-slate-500 h-full rounded-full"
                  />
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4 text-xs"
                  size="sm"
                >
                  Complete Profile
                </Button>
              </div>
            </motion.div>

            {/* Journaling Card */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader
                  icon={<BookOpen className="h-5 w-5 text-blue-500" />}
                  title="Journaling"
                />
                <div className="space-y-5 mt-2">
                  {userData.journaling.journalingStyle && (
                    <InfoRow
                      label="Style"
                      value={userData.journaling.journalingStyle}
                    />
                  )}
                  {userData.journaling.journalingTimeOfDay && (
                    <InfoRow
                      label="Time of Day"
                      value={userData.journaling.journalingTimeOfDay}
                      icon={<Clock className="h-3.5 w-3.5" />}
                    />
                  )}
                  <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg border border-border/40">
                    <span className="text-sm font-medium text-muted-foreground">
                      Mood Tracking
                    </span>
                    <div
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors",
                        userData.journaling.moodTrackingEnabled
                          ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {userData.journaling.moodTrackingEnabled ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" /> Enabled
                        </>
                      ) : (
                        "Disabled"
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Health Conditions */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader
                  icon={<Heart className="h-5 w-5 text-rose-500" />}
                  title="Health Conditions"
                />
                <div className="flex flex-wrap gap-2 mt-4">
                  {userData.healthConditions &&
                  userData.healthConditions.length > 0 ? (
                    userData.healthConditions.map((condition, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
                      >
                        {condition}
                      </span>
                    ))
                  ) : (
                    <div className="w-full text-center py-4 text-muted-foreground text-sm italic bg-muted/20 rounded-lg border border-dashed">
                      No conditions listed
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Helper Components

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-2xl border shadow-sm p-6 md:p-7 transition-all hover:shadow-md duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({
  icon,
  title,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-secondary/80 text-foreground">
          {icon}
        </div>
        <h2 className="font-medium text-lg tracking-tight">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  className,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={cn(
        "bg-card rounded-xl border p-4 md:p-5 flex items-center gap-4 transition-all hover:border-primary/50 hover:shadow-md group",
        className
      )}
    >
      <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center transition-all duration-300">
        {icon}
      </div>
      <div className="flex flex-col">
        <p className="text-sm font-normal text-muted-foreground transition-colors">
          {label}
        </p>
        <p className="font-medium text-lg text-foreground tracking-tight">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center pb-3 border-b border-border/40 last:border-0 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span className="font-medium text-sm text-foreground">{value}</span>
      </div>
    </div>
  );
}
