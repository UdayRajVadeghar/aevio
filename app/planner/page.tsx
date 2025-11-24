"use client";

import { motion } from "framer-motion";
import { Activity, Dumbbell, Leaf, Utensils, Brain } from "lucide-react";

export default function PlannerPage() {
  return (
    <main className="relative min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-hidden font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-black dark:to-neutral-900" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.05]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          {/* Header Content */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-6">
            <Activity size={14} />
            <span>AI Protocol Architect</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            DESIGN YOUR <br />
            <span className="text-neutral-400 dark:text-neutral-600">BLUEPRINT</span>
          </h1>
          
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
            Generate comprehensive optimization protocols. Whether it's hypertrophy, 
            mindfulness, or nutritional ketosis, our AI structures the path to your peak state.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Workout Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-100/50 dark:to-neutral-800/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-6 text-blue-500">
                <Dumbbell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Workout Protocol</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                Hypertrophy, strength, or endurance. Tailored split routines and progressive overload tracking.
              </p>
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">Create Plan →</span>
            </div>
          </motion.div>

          {/* Yoga/Mindfulness Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-100/50 dark:to-neutral-800/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-6 text-emerald-500">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Yoga & Mobility</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                Vinyasa flows, somatic release, and flexibility routines designed for recovery and mental clarity.
              </p>
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">Design Flow →</span>
            </div>
          </motion.div>

          {/* Diet Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group relative p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-100/50 dark:to-neutral-800/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-6 text-orange-500">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Nutrition Plan</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                Macro-optimized meal plans. Paleo, Keto, or Vegan. Fuel your body with precision.
              </p>
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">Build Diet →</span>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
