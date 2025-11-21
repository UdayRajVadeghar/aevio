"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------------------
// Neon Text Component
// -----------------------------------------------------------------------------

const NeonText = ({
  text,
  className,
  color = "cyan",
  intensity = "high",
}: {
  text: string;
  className?: string;
  color?: "cyan" | "pink" | "yellow" | "white";
  intensity?: "low" | "medium" | "high";
}) => {
  const [isFlickering, setIsFlickering] = useState(false);

  // Optimized random flickering effect
  useEffect(() => {
    let flickerTimeout: NodeJS.Timeout;
    let flickerInterval: NodeJS.Timeout;

    const triggerFlicker = () => {
      const flickerCount = Math.floor(Math.random() * 4) + 2; // 2 to 6 flickers (reduced)
      let currentFlicker = 0;

      flickerInterval = setInterval(() => {
        setIsFlickering((prev) => !prev);
        currentFlicker++;

        if (currentFlicker >= flickerCount) {
          clearInterval(flickerInterval);
          setIsFlickering(false);

          // Schedule next flicker storm with longer delays
          const nextDelay = Math.random() * 8000 + 4000; // 4s to 12s (increased)
          flickerTimeout = setTimeout(triggerFlicker, nextDelay);
        }
      }, 80 + Math.random() * 120); // Slightly slower flickering interval
    };

    const initialTimeout = setTimeout(triggerFlicker, 3000);
    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(flickerTimeout);
      clearInterval(flickerInterval);
    };
  }, []);

  // Color classes map
  const colorStyles = {
    cyan: {
      text: "text-cyan-500 dark:text-cyan-400",
      shadow:
        "dark:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] dark:shadow-cyan-500/50",
      dim: "text-cyan-900/30 dark:text-cyan-900/30",
    },
    pink: {
      text: "text-pink-500 dark:text-pink-400",
      shadow:
        "dark:drop-shadow-[0_0_10px_rgba(244,114,182,0.8)] dark:shadow-pink-500/50",
      dim: "text-pink-900/30 dark:text-pink-900/30",
    },
    yellow: {
      text: "text-yellow-500 dark:text-yellow-400",
      shadow:
        "dark:drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] dark:shadow-yellow-500/50",
      dim: "text-yellow-900/30 dark:text-yellow-900/30",
    },
    white: {
      text: "text-neutral-400 dark:text-white",
      shadow:
        "dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] dark:shadow-white/50",
      dim: "text-neutral-800/30 dark:text-neutral-700/30",
    },
  };

  const styles = colorStyles[color];

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Base layer (off state) - mostly visible when flickering off */}
      <span
        className={cn("absolute inset-0 select-none blur-[1px]", styles.dim)}
      >
        {text}
      </span>

      {/* Main layer (on state) */}
      <span
        className={cn(
          "relative z-10 transition-opacity duration-75",
          styles.text,
          !isFlickering && styles.shadow, // Only apply glow when NOT flickering (or invert logic if flicker means OFF)
          // Actually, flicker means toggling opacity.
          isFlickering ? "opacity-30 dark:opacity-20" : "opacity-100"
        )}
        style={{
          // Extra text shadow for neon glow effect in standard CSS
          textShadow:
            !isFlickering && intensity === "high"
              ? "currentColor 1px 0 10px"
              : "none",
        }}
      >
        {text}
      </span>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Wireframe Gym Storefront SVG
// -----------------------------------------------------------------------------

const WireframeStorefront = () => {
  return (
    <svg
      viewBox="0 0 800 400"
      className="w-full h-full absolute inset-0 pointer-events-none stroke-neutral-900/20 dark:stroke-white/20"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id="brick-pattern"
          x="0"
          y="0"
          width="40"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 20 L40 20 M20 0 L20 20"
            fill="none"
            strokeWidth="0.5"
            className="stroke-neutral-900/10 dark:stroke-white/10"
          />
        </pattern>
        <pattern
          id="shutter-pattern"
          x="0"
          y="0"
          width="40"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 10 L40 10" fill="none" strokeWidth="1" />
        </pattern>
      </defs>
      {/* --- Left Building (Shutter) --- */}
      <rect x="0" y="50" width="250" height="350" fill="none" strokeWidth="2" />
      {/* Roller Shutter Box */}
      <rect x="20" y="70" width="210" height="40" fill="none" strokeWidth="2" />
      <rect x="25" y="75" width="10" height="30" fill="none" strokeWidth="1" />
      {/* Shutter Door */}
      <rect
        x="30"
        y="110"
        width="190"
        height="290"
        fill="url(#shutter-pattern)"
        strokeWidth="2"
      />
      <path d="M30 400 L30 110 M220 110 L220 400" strokeWidth="2" />
      {/* Access Panel */}
      <rect x="230" y="80" width="15" height="20" fill="none" strokeWidth="1" />
      {/* --- Center Building (Entrance) --- */}
      <rect
        x="250"
        y="20"
        width="300"
        height="380"
        fill="url(#brick-pattern)"
        strokeWidth="2"
      />
      {/* Top Sign Board Area */}
      <rect
        x="250"
        y="20"
        width="300"
        height="80"
        fill="none"
        className="fill-neutral-100/50 dark:fill-neutral-900/50"
        strokeWidth="2"
      />
      {/* Main Window / Door Frame */}
      <rect
        x="270"
        y="120"
        width="260"
        height="280"
        fill="none"
        strokeWidth="2"
      />
      {/* Door */}
      <rect
        x="290"
        y="140"
        width="80"
        height="260"
        fill="none"
        strokeWidth="1"
      />
      <rect
        x="360"
        y="230"
        width="5"
        height="30"
        rx="2"
        fill="none"
        strokeWidth="1"
      />{" "}
      {/* Handle */}
      <text
        x="310"
        y="200"
        className="text-[10px] font-mono fill-current opacity-50"
        style={{ writingMode: "vertical-rl" }}
      >
        PUSH
      </text>
      {/* Big Window */}
      <rect
        x="390"
        y="140"
        width="120"
        height="180"
        fill="none"
        strokeWidth="1"
      />
      {/* Wireframe Weights inside window */}
      <circle cx="450" cy="300" r="15" fill="none" strokeWidth="1" />
      <circle cx="450" cy="300" r="25" fill="none" strokeWidth="1" />
      <rect
        x="445"
        y="250"
        width="10"
        height="100"
        fill="none"
        strokeWidth="1"
      />{" "}
      {/* Barbell vertical stand */}
      {/* --- Right Building (Lockers/Wall) --- */}
      <rect
        x="550"
        y="50"
        width="250"
        height="350"
        fill="none"
        strokeWidth="2"
      />
      {/* Panel Grid */}
      {Array.from({ length: 4 }).map((_, i) => (
        <g key={i}>
          <rect
            x={550 + i * 62.5}
            y="50"
            width="62.5"
            height="100"
            fill="none"
            strokeWidth="1"
          />
          <circle
            cx={550 + i * 62.5 + 10}
            cy="60"
            r="2"
            fill="none"
            strokeWidth="1"
          />
          <circle
            cx={550 + i * 62.5 + 52.5}
            cy="60"
            r="2"
            fill="none"
            strokeWidth="1"
          />
          <circle
            cx={550 + i * 62.5 + 10}
            cy="140"
            r="2"
            fill="none"
            strokeWidth="1"
          />
          <circle
            cx={550 + i * 62.5 + 52.5}
            cy="140"
            r="2"
            fill="none"
            strokeWidth="1"
          />
        </g>
      ))}
      {/* Garage Door / Loading Dock */}
      <rect
        x="570"
        y="180"
        width="210"
        height="220"
        fill="none"
        strokeWidth="2"
      />
      <path d="M570 250 L780 250" strokeWidth="1" />
      <rect
        x="600"
        y="260"
        width="60"
        height="30"
        fill="none"
        strokeWidth="1"
      />
      <rect
        x="720"
        y="260"
        width="60"
        height="30"
        fill="none"
        strokeWidth="1"
      />
    </svg>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function GymNeonShowcase() {
  return (
    <div className="w-full relative bg-neutral-50 dark:bg-black border-y border-neutral-200 dark:border-neutral-800 overflow-hidden">
      <div className="relative w-full max-w-5xl mx-auto h-[400px] md:h-[500px] flex items-center justify-center">
        {/* Architectural Wireframe Layer */}
        <div className="absolute inset-0 z-0">
          <WireframeStorefront />
        </div>

        {/* Neon Signs Layer - Positioned relative to the SVG coordinate approximation */}

        {/* Main Sign */}
        <div className="absolute top-[12%] left-[35%] md:left-[38%] z-10 transform -translate-x-1/2 md:translate-x-0">
          <NeonText
            text="GYM"
            color="yellow"
            className="text-4xl md:text-6xl font-black tracking-tighter font-sans border-4 border-yellow-500/20 dark:border-yellow-500/10 px-4 py-2 rounded-xl"
          />
        </div>

        {/* Side Sign (Open 24/7) */}
        <div className="absolute top-[45%] left-[36%] z-10">
          <div className="flex flex-col items-center gap-1">
            <NeonText
              text="OPEN 24/7"
              color="white"
              className="text-[10px] md:text-xs font-mono tracking-widest"
              intensity="low"
            />
            <div className="w-full h-[1px] bg-neutral-900/20 dark:bg-white/20" />
          </div>
        </div>

        {/* Window Neon (Dumbbell Icon simulation text) */}
        <div className="absolute top-[50%] left-[55%] z-10 rotate-[-10deg]">
          <NeonText
            text="NO PAIN"
            color="pink"
            className="text-lg md:text-xl font-bold font-mono"
            intensity="medium"
          />
        </div>

        <div className="absolute top-[58%] left-[58%] z-10 rotate-[-5deg]">
          <NeonText
            text="NO GAIN"
            color="cyan"
            className="text-lg md:text-xl font-bold font-mono"
            intensity="medium"
          />
        </div>

        {/* Address Number */}
        <div className="absolute top-[15%] left-[32%] z-0 opacity-50">
          <span className="text-sm font-mono text-neutral-900 dark:text-white">
            73
          </span>
        </div>
      </div>

      {/* Overlay Gradient for Depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-neutral-50 via-transparent to-transparent dark:from-black dark:via-transparent dark:to-transparent opacity-50" />
    </div>
  );
}
