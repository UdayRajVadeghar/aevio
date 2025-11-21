"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Separator } from "@/components/ui/shadcn/separator";
import { cn } from "@/lib/utils";
import {
    Activity,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    Heart,
    Ruler,
    Smile,
    Target,
    Trophy,
    User,
    Utensils,
    Weight,
} from "lucide-react";
import React from "react";

// Mock Data matching the schema
const userData = {
  basicProfile: {
    name: "Alex Johnson",
    dob: new Date("1995-06-15"),
    gender: "Male",
  },
  healthWellness: {
    height: 178,
    weight: 75,
    activityLevel: "Moderately Active",
    primaryGoal: "Improve Endurance",
    dietaryPreference: "High Protein",
  },
  journaling: {
    journalingStyle: "Reflective",
    journalingTimeOfDay: "Evening",
    moodTrackingEnabled: true,
  },
  habits: [
    {
      name: "Morning Run",
      type: "Fitness",
      target: 30,
      unit: "min",
      enabled: true,
    },
    {
      name: "Deep Work",
      type: "Productivity",
      target: 4,
      unit: "hours",
      enabled: true,
    },
    {
      name: "Hydration",
      type: "Health",
      target: 3000,
      unit: "ml",
      enabled: true,
    },
    {
      name: "Reading",
      type: "Learning",
      target: 20,
      unit: "pages",
      enabled: false,
    },
  ],
  healthConditions: ["Seasonal Allergies", "Mild Asthma"],
  goal: "Complete a half-marathon within the next 3 months and maintain a consistent sleep schedule.",
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                {userData.basicProfile.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <span className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3.5 w-3.5" />
                  {userData.basicProfile.dob.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="text-xs">•</span>
                <span className="text-sm">{userData.basicProfile.gender}</span>
              </div>
            </div>
          </div>
          <Button variant="outline">Edit Profile</Button>
        </header>

        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Main Stats */}
          <div className="md:col-span-2 space-y-6">
            {/* 30 Day Goal - Featured Card */}
            <Card className="bg-gradient-to-br from-primary/5 to-background border-primary/20">
              <CardHeader
                icon={<Trophy className="h-5 w-5 text-primary" />}
                title="30 Day Goal"
              />
              <p className="text-lg font-medium text-foreground leading-relaxed">
                &quot;{userData.goal}&quot;
              </p>
            </Card>

            {/* Health & Wellness Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <StatCard
                icon={<Ruler className="h-4 w-4" />}
                label="Height"
                value={`${userData.healthWellness.height} cm`}
              />
              <StatCard
                icon={<Weight className="h-4 w-4" />}
                label="Weight"
                value={`${userData.healthWellness.weight} kg`}
              />
              <StatCard
                icon={<Activity className="h-4 w-4" />}
                label="Activity Level"
                value={userData.healthWellness.activityLevel}
              />
              <StatCard
                icon={<Target className="h-4 w-4" />}
                label="Primary Goal"
                value={userData.healthWellness.primaryGoal}
              />
              {userData.healthWellness.dietaryPreference && (
                <div className="sm:col-span-2">
                  <StatCard
                    icon={<Utensils className="h-4 w-4" />}
                    label="Dietary Preference"
                    value={userData.healthWellness.dietaryPreference}
                  />
                </div>
              )}
            </div>

            {/* Habits Section */}
            <Card>
              <CardHeader
                icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                title="Active Habits"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {userData.habits.map((habit, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      habit.enabled
                        ? "bg-card border-border"
                        : "bg-muted/50 border-transparent opacity-60"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{habit.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {habit.type}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold text-primary">
                        {habit.target}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {habit.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Secondary Info */}
          <div className="space-y-6">
            {/* Journaling Preferences */}
            <Card>
              <CardHeader
                icon={<BookOpen className="h-5 w-5 text-blue-500" />}
                title="Journaling"
              />
              <div className="space-y-4 mt-4">
                <div className="flex justify-between items-center pb-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">Style</span>
                  <span className="font-medium text-sm">
                    {userData.journaling.journalingStyle}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border/50 last:border-0">
                  <span className="text-sm text-muted-foreground">
                    Time of Day
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium text-sm">
                      {userData.journaling.journalingTimeOfDay}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Mood Tracking
                  </span>
                  <div
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1",
                      userData.journaling.moodTrackingEnabled
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {userData.journaling.moodTrackingEnabled ? (
                      <>
                        <Smile className="h-3 w-3" /> Enabled
                      </>
                    ) : (
                      "Disabled"
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Health Conditions */}
            <Card>
              <CardHeader
                icon={<Heart className="h-5 w-5 text-red-500" />}
                title="Health Conditions"
              />
              <div className="flex flex-wrap gap-2 mt-4">
                {userData.healthConditions &&
                userData.healthConditions.length > 0 ? (
                  userData.healthConditions.map((condition, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                    >
                      {condition}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground italic">
                    None listed
                  </span>
                )}
              </div>
            </Card>

            {/* Quick Actions / Stats Summary */}
            <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider text-xs">
                Profile Completion
              </h3>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-primary">85%</span>
                <span className="text-sm text-muted-foreground mb-1">
                  completed
                </span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full mt-2 overflow-hidden">
                <div className="bg-primary h-full rounded-full w-[85%]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components for Cleaner Code

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
        "bg-card text-card-foreground rounded-xl border shadow-sm p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

function CardHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <h2 className="font-semibold text-lg">{title}</h2>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-background rounded-lg border p-4 flex items-center gap-4 transition-colors hover:border-primary/50 group">
      <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
