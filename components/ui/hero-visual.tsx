"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  TrendingUp,
  FileText,
  MoveUpRight,
  Utensils,
  Zap,
  Repeat,
} from "lucide-react";
import { useEffect, useState } from "react";

const TypingEffect = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          setDisplayedText("");
          i = 0;
        }, 3000);
      }
    }, 50);
    return () => clearInterval(timer);
  }, [text]);

  return <span>{displayedText}</span>;
};

export const HeroVisual = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "relative w-full h-[600px] flex items-center justify-center overflow-visible",
        className
      )}
    >
      {/* Ambient Background - The "Life Force" */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] bg-neutral-100/50 dark:bg-neutral-900/30 rounded-full blur-3xl opacity-60" />
      </div>

      {/* Structure: Central Spindle */}
      <div className="relative flex flex-col items-center justify-center gap-6">
        
        {/* Top Node: Journal (Mind) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20"
        >
          <div className="w-64 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-4 shadow-sm hover:scale-105 transition-transform duration-500">
            <div className="flex items-center gap-3 mb-3 border-b border-neutral-100 dark:border-neutral-800/50 pb-2">
              <div className="p-1.5 bg-orange-100/50 dark:bg-orange-900/20 rounded-lg text-orange-600 dark:text-orange-400">
                <FileText size={14} />
              </div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Journal Log
              </span>
            </div>
            <div className="font-mono text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed h-12">
              <TypingEffect text="Reflecting on deep work. Energy flows where focus goes..." />
            </div>
          </div>

          {/* Connection Line */}
          <div className="absolute left-1/2 -bottom-8 w-[1px] h-8 bg-gradient-to-b from-neutral-200 dark:from-neutral-800 to-transparent" />
        </motion.div>

        {/* Central Core Section */}
        <div className="flex items-center gap-8 relative z-10">
            
           {/* Left Wing: Consistency */}
           <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative hidden md:block"
           >
              <div className="w-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-4 shadow-sm hover:scale-105 transition-transform duration-500">
                <div className="flex items-center justify-between mb-2">
                     <div className="p-1.5 bg-purple-100/50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-400">
                         <Repeat size={14} />
                     </div>
                     <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Streak</span>
                </div>
                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-neutral-800 dark:text-white">12</span>
                    <span className="text-xs text-neutral-500">days</span>
                </div>
                <div className="flex gap-1 mt-2">
                    {[1,1,1,1,0,1,1].map((active, i) => (
                        <div key={i} className={cn("h-1 flex-1 rounded-full", active ? "bg-purple-500" : "bg-neutral-200 dark:bg-neutral-800")} />
                    ))}
                </div>
              </div>
              {/* Connection Line */}
              <div className="absolute -right-8 top-1/2 h-[1px] w-8 bg-gradient-to-r from-neutral-200 dark:from-neutral-800 to-transparent" />
           </motion.div>


            {/* Core */}
            <motion.div
                className="relative py-4 z-20"
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="relative w-32 h-32 flex items-center justify-center">
                <motion.div
                    className="absolute inset-0 rounded-full border border-neutral-200 dark:border-neutral-800"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                    className="absolute inset-4 rounded-full border border-neutral-200 dark:border-neutral-800"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0, 0.5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                />
                <div className="w-20 h-20 bg-white dark:bg-black rounded-full flex items-center justify-center shadow-2xl border border-neutral-100 dark:border-neutral-800 relative z-10">
                    <Brain
                    className="w-8 h-8 text-neutral-800 dark:text-neutral-200"
                    strokeWidth={1.5}
                    />
                </div>
                </div>
            </motion.div>

            {/* Right Wing: Nutrition */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative hidden md:block"
            >
              {/* Connection Line */}
              <div className="absolute -left-8 top-1/2 h-[1px] w-8 bg-gradient-to-l from-neutral-200 dark:from-neutral-800 to-transparent" />

              <div className="w-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-4 shadow-sm hover:scale-105 transition-transform duration-500">
                 <div className="flex items-center justify-between mb-2">
                     <div className="p-1.5 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-lg text-yellow-600 dark:text-yellow-400">
                         <Utensils size={14} />
                     </div>
                     <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Fuel</span>
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-neutral-500">Kcal</span>
                        <span className="font-mono text-neutral-800 dark:text-white">1,840</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 w-[65%]" />
                    </div>
                    <div className="flex justify-between text-[10px] text-neutral-400 pt-1">
                        <span>Protein</span>
                        <span>140g</span>
                    </div>
                </div>
              </div>
            </motion.div>
        </div>

        {/* Bottom Section: Split Nodes */}
        <div className="flex items-start gap-6 relative z-20">
          {/* Connection Lines */}
          <div className="absolute left-1/2 -top-8 w-[1px] h-8 bg-gradient-to-t from-neutral-200 dark:from-neutral-800 to-transparent -translate-x-1/2" />
          <div className="absolute left-1/2 -top-4 w-32 h-[1px] bg-neutral-200 dark:bg-neutral-800 -translate-x-1/2" />
          <div className="absolute left-[calc(50%-4rem)] -top-4 w-[1px] h-4 bg-neutral-200 dark:bg-neutral-800" />
          <div className="absolute right-[calc(50%-4rem)] -top-4 w-[1px] h-4 bg-neutral-200 dark:bg-neutral-800" />

          {/* Left Node: Health (Body) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-48 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-4 shadow-sm hover:scale-105 transition-transform duration-500"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-100/50 dark:bg-rose-900/20 rounded-lg text-rose-600 dark:text-rose-400">
                  <Activity size={14} />
                </div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Bio
                </span>
              </div>
              <span className="text-xs font-bold text-neutral-900 dark:text-white font-mono">
                98%
              </span>
            </div>
            <div className="flex items-end gap-[2px] h-8 w-full opacity-50">
              {[40, 70, 50, 90, 60, 80, 50, 70, 40, 60].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-rose-500 rounded-t-sm"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </motion.div>

          {/* Right Node: Growth (Progress) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-48 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-4 shadow-sm hover:scale-105 transition-transform duration-500"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <TrendingUp size={14} />
                </div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Growth
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-neutral-500">
                <span>Cognitive</span>
                <span className="text-emerald-500">+12%</span>
              </div>
              <div className="h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[75%]" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
