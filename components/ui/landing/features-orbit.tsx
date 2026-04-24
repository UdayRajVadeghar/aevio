"use client";

import { OrbitingCircles } from "@/components/ui/magic-ui/orbiting-circles";
import { cn } from "@/lib/utils";
import {
  Activity,
  BarChart3,
  Brain,
  Lock,
  Shield,
  TrendingUp,
  Zap,
} from "lucide-react";

export function FeaturesOrbit({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative flex h-[600px] w-full flex-col items-center justify-center overflow-visible",
        className,
      )}
    >
      {/* Central Element */}
      <div className="relative flex items-center justify-center">
        {/* Slow decorative ring */}
        <div
          className="absolute inset-[-40px] rounded-full border border-neutral-200/30 dark:border-neutral-700/30 bg-transparent shadow-xl animate-spin motion-reduce:animate-none [animation-duration:28s] overflow-hidden"
          style={{ willChange: "transform" }}
        ></div>

        {/* Center label */}
        <div className="relative z-10 flex h-32 w-32 flex-col items-center justify-center rounded-full border border-neutral-200/60 bg-white/70 backdrop-blur-sm dark:border-neutral-800/60 dark:bg-black/40">
          <span className="text-2xl font-bold tracking-widest text-neutral-900 dark:text-white font-mono lowercase">
            aevio
          </span>
          <span className="mt-1 text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            focus
          </span>
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
          <TrendingUp className="size-6 text-purple-500" />
        </div>
      </OrbitingCircles>
    </div>
  );
}
