"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Activity, Brain, TrendingUp, FileText, MoveUpRight } from "lucide-react";
import { useEffect, useState } from "react";

const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const floatAnimationDelayed = {
  initial: { y: 0 },
  animate: {
    y: [10, -10, 10],
    transition: {
      duration: 7,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 1,
    },
  },
};

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
            // simplistic loop
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
        "relative w-full aspect-square md:aspect-auto md:h-[500px] flex items-center justify-center overflow-hidden",
        className
      )}
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-neutral-200/50 dark:bg-neutral-800/30 rounded-full blur-3xl opacity-50 animate-pulse" />
      </div>

      {/* Connecting Lines (Abstract) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 dark:opacity-10">
        <motion.path
          d="M200,250 Q300,100 400,250 T600,250"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      </svg>

      {/* Main Container for Floating Elements */}
      <div className="relative w-full max-w-md h-full max-h-[400px] perspective-1000">
        
        {/* 1. Journal Card (Top Right) */}
        <motion.div
          variants={floatAnimation}
          initial="initial"
          animate="animate"
          className="absolute top-0 right-4 z-20"
        >
          <div className="w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xl backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
            <div className="flex items-center gap-2 mb-3 border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-md text-orange-600 dark:text-orange-400">
                <FileText size={14} />
              </div>
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Journal</span>
            </div>
            <div className="font-mono text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed h-16">
              <TypingEffect text="Clarity reached after morning meditation. Focus levels are stabilizing..." />
              <span className="animate-pulse inline-block w-1.5 h-3 bg-neutral-400 ml-1 align-middle" />
            </div>
          </div>
        </motion.div>

        {/* 2. Health/Biometrics (Bottom Left) */}
        <motion.div
          variants={floatAnimationDelayed}
          initial="initial"
          animate="animate"
          className="absolute bottom-12 left-0 z-30"
        >
          <div className="w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xl backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-rose-100 dark:bg-rose-900/30 rounded-md text-rose-600 dark:text-rose-400">
                        <Activity size={14} />
                    </div>
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Recovery</span>
                </div>
                <span className="text-xs font-bold text-neutral-900 dark:text-white">98%</span>
             </div>
             
             {/* Heart Rate Visualization */}
             <div className="flex items-end justify-between gap-1 h-12 w-full">
                {[40, 60, 55, 80, 70, 90, 65, 85, 50, 40].map((height, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: "20%" }}
                        animate={{ height: [`${height}%`, `${height * 0.6}%`, `${height}%`] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                        className="w-full bg-rose-500/20 dark:bg-rose-500/40 rounded-t-sm relative overflow-hidden"
                    >
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500 rounded-full" />
                    </motion.div>
                ))}
             </div>
          </div>
        </motion.div>

        {/* 3. Growth/Improvements (Center/Right Overlap) */}
        <motion.div
          animate={{
             y: [5, -5, 5],
             x: [5, 0, 5]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/4 z-10 scale-90 blur-[1px] opacity-80 hover:opacity-100 hover:blur-0 hover:scale-100 transition-all duration-500"
        >
             <div className="w-48 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-md text-emerald-600 dark:text-emerald-400">
                        <TrendingUp size={14} />
                    </div>
                    <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Growth</span>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500">Cognitive</span>
                        <span className="text-emerald-500 flex items-center gap-0.5 font-medium">+12% <MoveUpRight size={10} /></span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "78%" }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="h-full bg-emerald-500 rounded-full"
                        />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs mt-2">
                        <span className="text-neutral-500">Physical</span>
                        <span className="text-emerald-500 flex items-center gap-0.5 font-medium">+5% <MoveUpRight size={10} /></span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                         <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: "65%" }}
                            transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
                            className="h-full bg-emerald-500 rounded-full"
                        />
                    </div>
                </div>
             </div>
        </motion.div>

        {/* Central Node (The User/Core) */}
        <motion.div
            className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 z-0"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
        >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-2xl flex items-center justify-center">
                <Brain className="text-neutral-400 dark:text-neutral-600 w-8 h-8 opacity-50" />
            </div>
        </motion.div>

      </div>
    </div>
  );
};

