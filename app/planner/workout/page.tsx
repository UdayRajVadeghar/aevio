"use client";

import PlannerSetupWizard from "@/components/planner/PlannerSetupWizard";
import { motion } from "framer-motion";

export default function WorkoutPlannerPage() {
  return (
    <main className="relative min-h-screen bg-neutral-50 dark:bg-black text-black dark:text-white py-20 px-4 md:px-6 overflow-hidden">
      {/* SaaS Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neutral-50 via-white to-blue-50/50 dark:from-neutral-950 dark:via-black dark:to-blue-900/20" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] dark:opacity-[0.06]" />
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
