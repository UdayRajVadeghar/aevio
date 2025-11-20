"use client";

import { cn } from "@/lib/utils";

export const Dither = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-[9999] mix-blend-overlay opacity-[0.15]",
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
      }}
    />
  );
};

export const DitherFilter = () => (
  <svg className="hidden">
    <defs>
      <filter id="dither-filter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="1"
          stitchTiles="stitch"
          result="noise"
        />
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 0.5 0" // Adjust alpha
          in="noise"
          result="noiseAlpha"
        />
        <feBlend
          mode="overlay"
          in="SourceGraphic"
          in2="noiseAlpha"
          result="blend"
        />
      </filter>
    </defs>
  </svg>
);
