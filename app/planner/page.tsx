"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  CheckCircle,
  Cpu,
  Dumbbell,
  Layers,
  Leaf,
  Settings,
  Utensils,
} from "lucide-react";
import Link from "next/link";

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

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 font-sans">
            DESIGN YOUR <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-500 to-neutral-900 dark:from-white dark:via-neutral-500 dark:to-white animate-text-shimmer bg-[length:200%_auto]">
              BLUEPRINT
            </span>
          </h1>

          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
            Generate comprehensive optimization protocols. Whether it's
            hypertrophy, mindfulness, or nutritional ketosis, our AI structures
            the path to your peak state.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Workout Card */}
          <Link href="/planner/workout" className="contents">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-100/50 dark:to-neutral-800/20 opacity-0 group-hover:opacity-100 transition-opacity" />

              <Dumbbell className="absolute -bottom-4 -right-4 w-32 h-32 text-neutral-200 dark:text-neutral-800 opacity-20 -rotate-12 transition-transform duration-500 group-hover:scale-110" />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-6 text-blue-500">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Workout Protocol</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                  Hypertrophy, strength, or endurance. Tailored split routines
                  and progressive overload tracking.
                </p>
                <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                  Create Plan →
                </span>
              </div>
            </motion.div>
          </Link>

          {/* Yoga/Mindfulness Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group relative p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neutral-100/50 dark:to-neutral-800/20 opacity-0 group-hover:opacity-100 transition-opacity" />

            <Leaf className="absolute -bottom-4 -right-4 w-32 h-32 text-neutral-200 dark:text-neutral-800 opacity-20 -rotate-12 transition-transform duration-500 group-hover:scale-110" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-6 text-emerald-500">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Yoga & Mobility</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                Vinyasa flows, somatic release, and flexibility routines
                designed for recovery and mental clarity.
              </p>
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                Design Flow →
              </span>
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

            <Utensils className="absolute -bottom-4 -right-4 w-32 h-32 text-neutral-200 dark:text-neutral-800 opacity-20 -rotate-12 transition-transform duration-500 group-hover:scale-110" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800 flex items-center justify-center mb-6 text-orange-500">
                <Utensils className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Nutrition Plan</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                Macro-optimized meal plans. Paleo, Keto, or Vegan. Fuel your
                body with precision.
              </p>
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                Build Diet →
              </span>
            </div>
          </motion.div>
        </div>

        {/* Methodology Section */}
        <div className="mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-6 font-sans">
              THE{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-500 to-neutral-900 dark:from-white dark:via-neutral-500 dark:to-white animate-text-shimmer bg-[length:200%_auto]">
                METHODOLOGY
              </span>
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Our proprietary engine analyzes 50+ biomarkers and lifestyle
              factors to construct your ideal regimen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              {[
                {
                  icon: Brain,
                  title: "Neural Adaptation",
                  desc: "The algorithm learns from your feedback loops. Too intense? It scales back. Not challenging enough? It increases volume.",
                  color: "text-rose-500",
                  bg: "bg-rose-500/10",
                },
                {
                  icon: Cpu,
                  title: "Biometric Sync",
                  desc: "Integrates with wearables to adjust daily targets based on HRV, sleep quality, and recovery scores.",
                  color: "text-violet-500",
                  bg: "bg-violet-500/10",
                },
                {
                  icon: Layers,
                  title: "Periodization Logic",
                  desc: "Automatic macro, meso, and micro-cycle planning to prevent plateaus and optimize performance peaks.",
                  color: "text-amber-500",
                  bg: "bg-amber-500/10",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group p-6 rounded-2xl bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-lg dark:hover:shadow-neutral-900/50 cursor-default"
                >
                  <div className="flex gap-5">
                    <div
                      className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                        {feature.title}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono text-neutral-400">
                          // DETECTED
                        </span>
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="sticky top-24">
              <div className="relative rounded-3xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-8 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.05]" />
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <Cpu className="w-24 h-24 text-black dark:text-white" />
                </div>

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-xl border border-black/5 dark:border-white/10 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                      <span className="font-mono text-sm text-neutral-700 dark:text-neutral-200">
                        System_Load
                      </span>
                    </div>
                    <div className="text-sm font-bold text-emerald-500 dark:text-emerald-400 flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      OPTIMAL
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-xl border border-black/5 dark:border-white/10 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                        <span className="font-mono text-xs text-neutral-600 dark:text-neutral-300">
                          Recovery
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-black dark:text-white">
                        98%
                      </div>
                    </div>
                    <div className="p-4 bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-xl border border-black/5 dark:border-white/10 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                        <span className="font-mono text-xs text-neutral-600 dark:text-neutral-300">
                          Next_Session
                        </span>
                      </div>
                      <div className="text-sm font-bold text-black dark:text-white mt-1">
                        READY
                      </div>
                    </div>
                  </div>

                  {/* Bar Graph Visualization */}
                  <div className="p-5 bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-xl border border-black/5 dark:border-white/10 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                        <span className="font-mono text-xs text-neutral-600 dark:text-neutral-500 uppercase tracking-wider">
                          Load_Distribution
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">
                        7_DAY_AVG
                      </span>
                    </div>
                    <div className="flex items-end justify-between gap-2 h-24 w-full">
                      {[35, 70, 45, 90, 60, 85, 40].map((height, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-2 w-full h-full justify-end group cursor-crosshair"
                        >
                          <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: `${height}%` }}
                            transition={{
                              duration: 0.8,
                              delay: i * 0.1,
                              ease: "easeOut",
                            }}
                            viewport={{ once: true }}
                            className="w-full relative rounded-[2px] bg-neutral-300 dark:bg-neutral-800 overflow-hidden"
                          >
                            <motion.div
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              transition={{ delay: 0.5 + i * 0.1 }}
                              className="absolute inset-0 bg-black dark:bg-white opacity-80 group-hover:opacity-100 transition-opacity"
                            />
                          </motion.div>
                          <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-600 group-hover:text-black dark:group-hover:text-white transition-colors">
                            {["M", "T", "W", "T", "F", "S", "S"][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-white/60 dark:bg-black/60 rounded-xl border border-black/5 dark:border-white/5 font-mono text-xs text-neutral-600 dark:text-neutral-400">
                    <div className="flex gap-2 mb-2">
                      <span className="text-emerald-500">$</span>
                      <span>analysis_complete --v 2.4.0</span>
                    </div>
                    <div className="space-y-1 pl-4 border-l border-black/10 dark:border-white/10">
                      <p className="opacity-60">
                        &gt; analyzing recent_performance...
                      </p>
                      <p className="opacity-80">
                        &gt; adjusting volume parameters...
                      </p>
                      <p className="opacity-100 text-neutral-900 dark:text-neutral-300">
                        &gt; protocol generated successfully.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
