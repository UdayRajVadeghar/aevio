"use client";

import PlannerSetupWizard from "@/components/planner/PlannerSetupWizard";
import { motion } from "framer-motion";

export default function WorkoutPlannerPage() {
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
