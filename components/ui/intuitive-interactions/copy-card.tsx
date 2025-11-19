"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function CopyCard() {
  const [status, setStatus] = useState<"idle" | "generated">("idle");

  useEffect(() => {
    // Auto-play loop
    const cycle = async () => {
      // Stay in idle for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Switch to generated
      setStatus("generated");
      // Stay generated for 2.5 seconds
      await new Promise((resolve) => setTimeout(resolve, 2500));
      // Revert to idle
      setStatus("idle");
    };

    // Using interval for simpler reliable looping
    const interval = setInterval(() => {
      setStatus((prev) => (prev === "idle" ? "generated" : "idle"));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Better effect for precise timing control
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (status === "idle") {
      // Wait 1.5s before triggering "click"
      timeout = setTimeout(() => {
        setStatus("generated");
      }, 1500);
    } else {
      // Wait 2.5s before reverting
      timeout = setTimeout(() => {
        setStatus("idle");
      }, 2500);
    }
    return () => clearTimeout(timeout);
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-white rounded-3xl shadow-sm border border-neutral-100">
      <div className="mb-8 text-center">
        <h3 className="text-lg font-semibold mb-1">AI Workout Plans</h3>
        <p className="text-sm text-neutral-500 max-w-[220px]">
          Instantly generate personalized routines based on your goals.
        </p>
      </div>

      <div className="h-12 w-full max-w-[240px] relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          {status === "idle" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="flex w-full h-full rounded-full bg-neutral-100 p-1 overflow-hidden cursor-default"
            >
              <div className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-neutral-700 hover:bg-white hover:shadow-sm rounded-full transition-all duration-200">
                <Sparkles className="w-4 h-4" />
                <span>Generate</span>
              </div>
              <div className="w-px h-4 bg-neutral-300 my-auto mx-1" />
              <div className="flex-1 flex items-center justify-center text-sm font-medium text-neutral-700 opacity-50">
                Customize
              </div>
            </motion.div>
          ) : (
            <motion.button
              key="generated"
              layoutId="copy-button"
              initial={{ opacity: 0, scale: 0.9, width: "100%" }}
              animate={{ opacity: 1, scale: 1, width: "100%" }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute inset-0 flex items-center justify-center gap-2 bg-black text-white rounded-full text-sm font-medium"
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Plan Ready
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
