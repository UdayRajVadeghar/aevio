"use client";

import PlannerSetupWizard from "@/components/planner/PlannerSetupWizard";
import { motion } from "framer-motion";

export default function WorkoutPlannerPage() {
  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-black text-black dark:text-white py-20 px-4 md:px-6">
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[url('/grid.svg')] dark:opacity-[0.05]" />

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
