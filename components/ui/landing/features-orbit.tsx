"use client";

import { OrbitingCircles } from "@/components/ui/magic-ui/orbiting-circles";
import { cn } from "@/lib/utils";
import { 
  Activity, 
  BarChart3, 
  Brain, 
  Shield, 
  Zap, 
  Lock, 
  Fingerprint
} from "lucide-react";

export function FeaturesOrbit({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex h-[600px] w-full flex-col items-center justify-center overflow-visible", className)}>
      
      {/* Ambient Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <div className="w-[700px] h-[700px] bg-neutral-100/50 dark:bg-neutral-900/30 rounded-full blur-3xl opacity-60" />
      </div>

      {/* Central Element */}
      <div className="relative flex items-center justify-center group cursor-pointer">
         {/* The Bubble - Spinning */}
         <div className="absolute inset-[-20px] rounded-full border border-neutral-200/50 dark:border-neutral-700/50 bg-white/10 dark:bg-black/10 shadow-xl backdrop-blur-[2px] animate-spin [animation-duration:10s] group-hover:[animation-play-state:paused]">
            {/* Inner details to make spin visible */}
            <div className="absolute top-4 right-6 h-6 w-10 rotate-45 rounded-full bg-gradient-to-b from-white to-transparent opacity-60 blur-sm" />
            <div className="absolute bottom-6 left-8 h-4 w-6 rotate-45 rounded-full bg-gradient-to-t from-white to-transparent opacity-40 blur-sm" />
         </div>

         {/* The 'a' Character - Static */}
         <div className="relative z-10 flex items-center justify-center w-32 h-32 bg-transparent rounded-full">
            <span className="text-8xl font-black tracking-tighter text-neutral-900 dark:text-white font-serif italic" style={{ fontFamily: 'Times New Roman, serif' }}>
              a
            </span>
         </div>
      </div>

      {/* Inner Orbit */}
      <OrbitingCircles
        className="size-[40px] border-none bg-transparent"
        duration={25}
        radius={130}
      >
        <div className="flex items-center justify-center w-full h-full rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <Brain className="size-5 text-neutral-800 dark:text-neutral-200" />
        </div>
        <div className="flex items-center justify-center w-full h-full rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <Zap className="size-5 text-amber-500" />
        </div>
        <div className="flex items-center justify-center w-full h-full rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-sm">
             <Lock className="size-5 text-neutral-500" />
        </div>
      </OrbitingCircles>

      {/* Outer Orbit */}
      <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={210}
        duration={35}
        reverse
      >
        <div className="flex items-center justify-center w-full h-full rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <BarChart3 className="size-6 text-blue-500" />
        </div>
        <div className="flex items-center justify-center w-full h-full rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <Activity className="size-6 text-rose-500" />
        </div>
        <div className="flex items-center justify-center w-full h-full rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <Shield className="size-6 text-emerald-500" />
        </div>
        <div className="flex items-center justify-center w-full h-full rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <Fingerprint className="size-6 text-purple-500" />
        </div>
      </OrbitingCircles>
    </div>
  );
}
