"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles, Wand2 } from "lucide-react";
import { useEffect, useState } from "react";

export function CopyCard() {
  const [status, setStatus] = useState<"idle" | "generating" | "generated">(
    "idle"
  );

  useEffect(() => {
    const runCycle = async () => {
      // Initial delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Start cycle
      while (true) {
        // 1. Click effect / Generating state
        setStatus("generating");
        await new Promise((resolve) => setTimeout(resolve, 300));

        // 2. Generated state (Success)
        setStatus("generated");
        await new Promise((resolve) => setTimeout(resolve, 2500)); // Hold success state

        // 3. Revert to idle
        setStatus("idle");
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait before next loop
      }
    };

    runCycle();
    return () => {}; // Cleanup handled by component unmount naturally
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-white dark:bg-black rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-800 transition-colors duration-300">
      <div className="mb-8 text-center space-y-2">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-900 mb-2">
          <Wand2 className="w-5 h-5 text-black dark:text-white" />
        </div>
        <h3 className="text-xl font-bold text-black dark:text-white">
          AI Workout Plans
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-[240px] mx-auto leading-relaxed">
          Generate a personalized 12-week strength program in seconds.
        </p>
      </div>

      <div className="h-14 w-full max-w-[260px] relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          {status === "idle" || status === "generating" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: status === "generating" ? 0.95 : 1, // Click press effect
              }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="relative z-10 flex w-full h-full rounded-full bg-neutral-100 dark:bg-neutral-900 p-1.5 overflow-hidden cursor-default shadow-inner dark:shadow-none"
            >
              {/* Simulated Click Indicator */}
              {status === "generating" && (
                <motion.div
                  layoutId="click-overlay"
                  className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-full z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}

              <div className="flex-1 flex items-center justify-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 rounded-full shadow-sm transition-all duration-200 border border-black/5 dark:border-white/5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Generate</span>
              </div>
              <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-700 my-auto mx-2" />
              <div className="flex-1 flex items-center justify-center text-sm font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
                Customize
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="generated"
              layoutId="copy-button"
              initial={{ opacity: 0, scale: 0.9, width: "100%" }}
              animate={{ opacity: 1, scale: 1, width: "100%" }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }} // Snappier
              className="absolute inset-0 flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-bold shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10"
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, type: "spring" }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3px]" />
                Plan Ready
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Background Glow for idle state */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl opacity-50 dark:opacity-30 pointer-events-none" />
      </div>
    </div>
  );
}
