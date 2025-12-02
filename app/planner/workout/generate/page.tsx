"use client";

import { Button } from "@/components/ui/shadcn/button";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Calendar,
  Dumbbell,
  Loader2,
  Settings,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WorkoutGeneratePage() {
  const router = useRouter();
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isSessionLoading) return;

    if (!session?.user?.id) {
      router.push("/planner/workout");
      return;
    }

    // Check if workout planner is completed
    const checkStatus = async () => {
      try {
        const response = await fetch(
          `/api/user/workout-planner/complete?userId=${session.user.id}`
        );

        if (response.ok) {
          const data = await response.json();
          if (!data.completed) {
            // Workout planner not completed, redirect to setup
            router.push("/planner/workout");
            return;
          }
        } else if (response.status === 404) {
          router.push("/onboarding");
          return;
        }
      } catch (error) {
        console.error("Error checking status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [session, isSessionLoading, router]);

  if (isSessionLoading || isLoading) {
    return (
      <main className="min-h-screen bg-[#f5f5f4] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p className="text-neutral-500 dark:text-neutral-400">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-[#f5f5f4] dark:bg-[#0a0a0a] text-black dark:text-white overflow-hidden">
      {/* Background */}
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
              "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(37,99,235,0.04) 45%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Profile Complete</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent">
              Your Workout Architect
            </h1>
            <p className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
              Your profile is set up. Now let&apos;s generate your personalized
              training program.
            </p>
          </motion.div>

          {/* Action Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            {/* Generate Plan Card */}
            <div className="group relative bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/20 rounded-2xl flex items-center justify-center mb-6">
                  <Bot className="w-7 h-7 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Generate New Plan</h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                  Let AI create a custom workout program based on your goals,
                  schedule, and preferences.
                </p>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Plan
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xl">
              <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  {
                    icon: Calendar,
                    label: "View Schedule",
                    desc: "See your weekly training calendar",
                    color: "text-blue-500",
                    bgColor: "bg-blue-50 dark:bg-blue-900/20",
                  },
                  {
                    icon: Dumbbell,
                    label: "Browse Exercises",
                    desc: "Explore exercise library",
                    color: "text-purple-500",
                    bgColor: "bg-purple-50 dark:bg-purple-900/20",
                  },
                  {
                    icon: Target,
                    label: "Track Progress",
                    desc: "Monitor your gains",
                    color: "text-emerald-500",
                    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
                  },
                ].map((action, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors text-left cursor-pointer"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${action.bgColor} flex items-center justify-center`}
                    >
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{action.label}</p>
                      <p className="text-xs text-neutral-500">{action.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-400" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Your Profile Summary</h3>
              <Link href="/planner/workout">
                <Button variant="ghost" size="sm" className="text-neutral-500">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Training Days", value: "Ready", icon: Calendar },
                { label: "Experience", value: "Set", icon: Zap },
                { label: "Equipment", value: "Configured", icon: Dumbbell },
                { label: "Goals", value: "Defined", icon: Target },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-center p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50"
                >
                  <stat.icon className="w-5 h-5 mx-auto mb-2 text-orange-500" />
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-neutral-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-8"
          >
            <Link
              href="/planner"
              className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              ← Back to Planner Hub
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

