"use client";

import { DotPattern } from "@/components/ui/magic-ui/dot-pattern";
import { OrbitingCircles } from "@/components/ui/magic-ui/orbiting-circles";
import { cn } from "@/lib/utils";
import { 
  Activity, 
  BarChart3, 
  Brain, 
  Lock, 
  Shield, 
  Sparkles, 
  Zap
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
         <div className="absolute inset-[-40px] rounded-full border border-neutral-200/30 dark:border-neutral-700/30 bg-transparent shadow-xl animate-spin [animation-duration:20s] group-hover:[animation-play-state:paused] overflow-hidden">
            
            {/* Dot Pattern Background Inside Bubble */}
             <DotPattern
                 className={cn(
                     "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
                 )}
                 width={10}
                 height={10}
                 cr={1}
                 cx={1}
                 cy={1}
             />

            {/* Inner details to make spin visible */}
            <div className="absolute top-8 right-10 h-8 w-14 rotate-45 rounded-full bg-gradient-to-b from-white to-transparent opacity-60 blur-sm" />
            <div className="absolute bottom-10 left-12 h-6 w-10 rotate-45 rounded-full bg-gradient-to-t from-white to-transparent opacity-40 blur-sm" />
         </div>

         {/* The 'aevio' Text - Static but Crazy */}
         <div className="relative z-10 flex items-center justify-center w-32 h-32 bg-transparent rounded-full">
            <div className="relative">
                <span className="relative text-2xl font-bold tracking-widest text-neutral-900 dark:text-white font-mono lowercase">
                    aevio
                </span>
            </div>
         </div>
      </div>

      {/* Orbit 1 (Inner) - Radius 90 */}
      <OrbitingCircles
        className="size-[35px] border-none bg-transparent"
        duration={20}
        radius={90}
      >
        <div className="flex items-center justify-center w-full h-full rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <Brain className="size-4 text-neutral-800 dark:text-neutral-200" />
        </div>
        <div className="flex items-center justify-center w-full h-full rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <Zap className="size-4 text-amber-500" />
        </div>
      </OrbitingCircles>

      {/* Orbit 2 (Middle) - Radius 170 */}
      <OrbitingCircles
        className="size-[40px] border-none bg-transparent"
        radius={170}
        duration={30}
        reverse
      >
        <div className="flex items-center justify-center w-full h-full rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-sm">
             <Lock className="size-5 text-neutral-500" />
        </div>
        <div className="flex items-center justify-center w-full h-full rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <Activity className="size-5 text-rose-500" />
        </div>
        <div className="flex items-center justify-center w-full h-full rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <Shield className="size-5 text-emerald-500" />
        </div>
      </OrbitingCircles>

       {/* Orbit 3 (Outer) - Radius 260 */}
       <OrbitingCircles
        className="size-[50px] border-none bg-transparent"
        radius={260}
        duration={40}
      >
        <div className="flex items-center justify-center w-full h-full rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <BarChart3 className="size-6 text-blue-500" />
        </div>
        <div className="flex items-center justify-center w-full h-full rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <Sparkles className="size-6 text-purple-500" />
        </div>
      </OrbitingCircles>
    </div>
  );
}
