"use client";

import PlannerSetupWizard from "@/components/planner/PlannerSetupWizard";
import { Button } from "@/components/ui/shadcn/button";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { Dumbbell, Loader2, Lock, Sparkles, Target, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WorkoutPlannerPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const checkWorkoutPlannerStatus = async () => {
      if (isSessionLoading) return;

      if (!session?.user?.id) {
        // User not logged in, show login prompt
        setShowLoginPrompt(true);
        setIsCheckingStatus(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/user/workout-planner/complete?userId=${session.user.id}`
        );

        if (response.ok) {
          const data = await response.json();

          if (data.completed) {
            // Workout planner already completed, redirect to generate page
            router.push("/planner/workout/generate");
            return;
          }
        } else if (response.status === 404) {
          // User profile not found, redirect to onboarding
          router.push("/onboarding");
          return;
        }

        // User hasn't completed workout planner, show the wizard
        setShowWizard(true);
      } catch (error) {
        console.error("Error checking workout planner status:", error);
        // On error, show the wizard anyway
        setShowWizard(true);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkWorkoutPlannerStatus();
  }, [session, isSessionLoading, router]);

  // Show loading while checking session or workout planner status
  if (isSessionLoading || isCheckingStatus) {
    return (
      <main className="min-h-screen bg-[#f5f5f4] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-neutral-500 dark:text-neutral-400">Loading...</p>
        </div>
      </main>
    );
  }

  // Show login prompt for unauthenticated users
  if (showLoginPrompt) {
    return (
      <main className="relative min-h-screen bg-[#f5f5f4] dark:bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-neutral-100 to-stone-200 dark:from-neutral-950 dark:via-zinc-900 dark:to-neutral-950" />
          <div
            className="absolute -top-[300px] -right-[200px] w-[800px] h-[800px] rounded-full blur-[150px]"
            style={{
              background:
                "radial-gradient(circle, rgba(251,146,60,0.2) 0%, rgba(245,158,11,0.08) 40%, transparent 65%)",
            }}
          />
          <div
            className="absolute -bottom-[200px] -left-[150px] w-[600px] h-[600px] rounded-full blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.05) 45%, transparent 70%)",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-lg mx-4"
        >
          <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 md:p-12 shadow-2xl shadow-neutral-200/50 dark:shadow-neutral-900/50">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/20 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200/30 dark:shadow-orange-900/20">
                  <Dumbbell className="w-10 h-10 text-orange-500" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Lock className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent">
                Unlock Your Workout Blueprint
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Sign in to access AI-powered workout planning tailored to your
                body, goals, and schedule.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="grid grid-cols-1 gap-3 mb-8"
            >
              {[
                {
                  icon: Target,
                  text: "Personalized training plans",
                  color: "text-orange-500",
                },
                {
                  icon: Sparkles,
                  text: "AI-optimized progressions",
                  color: "text-blue-500",
                },
                {
                  icon: Zap,
                  text: "Smart recovery scheduling",
                  color: "text-amber-500",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50"
                >
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {feature.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-3"
            >
              <Link href="/authentication" className="block">
                <Button className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/40">
                  Sign In to Get Started
                </Button>
              </Link>
              <Link href="/planner" className="block">
                <Button
                  variant="ghost"
                  className="w-full h-12 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                  ← Back to Planner
                </Button>
              </Link>
            </motion.div>

            {/* Footer note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-center text-xs text-neutral-400 dark:text-neutral-500 mt-6"
            >
              New here?{" "}
              <Link
                href="/authentication"
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Create an account
              </Link>{" "}
              — it&apos;s free!
            </motion.p>
          </div>
        </motion.div>
      </main>
    );
  }

  // Don't show anything if we're about to redirect or wizard isn't ready
  if (!showWizard) {
    return (
      <main className="min-h-screen bg-[#f5f5f4] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-neutral-500 dark:text-neutral-400">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#f5f5f4] dark:bg-[#0a0a0a] text-black dark:text-white py-20 px-4 md:px-6 overflow-hidden">
      {/* Industrial Gym Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Base - concrete/steel gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-neutral-100 to-stone-200 dark:from-neutral-950 dark:via-zinc-900 dark:to-neutral-950" />

        {/* Dramatic orange/amber accent - like gym lighting */}
        <div
          className="absolute -top-[300px] -right-[200px] w-[800px] h-[800px] rounded-full blur-[150px]"
          style={{
            background:
              "radial-gradient(circle, rgba(251,146,60,0.25) 0%, rgba(245,158,11,0.1) 40%, transparent 65%)",
          }}
        />

        {/* Deep red power accent - bottom left */}
        <div
          className="absolute -bottom-[200px] -left-[150px] w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(220,38,38,0.18) 0%, rgba(185,28,28,0.06) 45%, transparent 70%)",
          }}
        />

        {/* Steel/chrome highlight - center */}
        <div
          className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[1000px] h-[400px] blur-[100px]"
          style={{
            background:
              "radial-gradient(ellipse, rgba(161,161,170,0.15) 0%, transparent 60%)",
          }}
        />

        {/* Crosshatch pattern - industrial texture */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="gym-grid"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              {/* Vertical lines */}
              <line
                x1="30"
                y1="0"
                x2="30"
                y2="60"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              {/* Horizontal lines */}
              <line
                x1="0"
                y1="30"
                x2="60"
                y2="30"
                stroke="currentColor"
                strokeWidth="0.5"
              />
              {/* Corner accents */}
              <rect
                x="28"
                y="28"
                width="4"
                height="4"
                fill="currentColor"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#gym-grid)"
            className="text-neutral-600 dark:text-neutral-400"
          />
        </svg>

        {/* Diagonal power stripes */}
        <div className="absolute top-0 right-0 w-full h-full overflow-hidden opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute -top-[50%] -right-[20%] w-[200px] h-[200%] bg-gradient-to-b from-transparent via-orange-500 to-transparent rotate-[25deg]" />
          <div className="absolute -top-[50%] -right-[30%] w-[100px] h-[200%] bg-gradient-to-b from-transparent via-red-600 to-transparent rotate-[25deg]" />
          <div className="absolute -top-[50%] -right-[35%] w-[50px] h-[200%] bg-gradient-to-b from-transparent via-orange-500 to-transparent rotate-[25deg]" />
        </div>

        {/* Subtle metallic noise */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Animated pulse rings - like heartbeat/power */}
        <motion.div
          className="absolute top-[15%] right-[10%] w-4 h-4 rounded-full border-2 border-orange-500/40"
          animate={{
            scale: [1, 2.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-[30%] left-[8%] w-3 h-3 rounded-full border-2 border-red-500/30"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.4, 0, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeOut",
            delay: 1.5,
          }}
        />

        {/* Top edge accent - like gym equipment trim */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

        {/* Subtle corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-neutral-300/20 dark:border-neutral-700/30" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-neutral-300/20 dark:border-neutral-700/30" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-4xl mx-auto"
      >
        <PlannerSetupWizard />
      </motion.div>
    </main>
  );
}
