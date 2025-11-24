"use client";

import { motion } from "framer-motion";
import { Activity, Dumbbell, Timer, Zap } from "lucide-react";

export default function WorkoutPage() {
  return (
    <main className="relative min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-hidden font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-black dark:to-neutral-900" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.05]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-6">
            <Activity size={14} />
            <span>Active Session</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            WORKOUT <br />
            <span className="text-neutral-400 dark:text-neutral-600">PROTOCOL</span>
          </h1>
          
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
            Design your training regimen with precision. Track progressive overload, 
            monitor rest intervals, and optimize your physical output.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group relative p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-100/50 dark:to-neutral-800/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-6">
                <Dumbbell className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Strength</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Compound movements focused on hypertrophy and max force production.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-100/50 dark:to-neutral-800/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-6">
                <Timer className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Endurance</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                High-intensity interval training to improve cardiovascular capacity.
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group relative p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-100/50 dark:to-neutral-800/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Power</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Explosive movements targeting speed and neuromuscular efficiency.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

