"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------------------
// Neon Text Component
// -----------------------------------------------------------------------------

interface NeonTextProps {
  text: string;
  className?: string;
  color?: "cyan" | "pink" | "yellow" | "white" | "primary";
  intensity?: "low" | "medium" | "high";
  flicker?: boolean;
}

const NeonText = ({
  text,
  className,
  color = "cyan",
  intensity = "high",
  flicker = true,
}: NeonTextProps) => {
  const [isFlickering, setIsFlickering] = useState(false);

  // Randomized flicker effect
  useEffect(() => {
    if (!flicker) return;

    let timeout: NodeJS.Timeout;
    const triggerFlicker = () => {
      const duration = Math.random() * 200 + 50;
      setIsFlickering(true);
      timeout = setTimeout(() => {
        setIsFlickering(false);
        timeout = setTimeout(triggerFlicker, Math.random() * 5000 + 2000);
      }, duration);
    };

    timeout = setTimeout(triggerFlicker, Math.random() * 2000);
    return () => clearTimeout(timeout);
  }, [flicker]);

  // Color classes map
  const colorStyles = {
    cyan: {
      text: "text-cyan-600 dark:text-cyan-400",
      glow: "drop-shadow-[0_0_2px_rgba(8,145,178,0.8)] dark:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]",
      border: "border-cyan-600/30 dark:border-cyan-400/30",
      bg: "bg-cyan-950/5 dark:bg-cyan-400/5",
    },
    pink: {
      text: "text-pink-600 dark:text-pink-400",
      glow: "drop-shadow-[0_0_2px_rgba(219,39,119,0.8)] dark:drop-shadow-[0_0_5px_rgba(244,114,182,0.8)]",
      border: "border-pink-600/30 dark:border-pink-400/30",
      bg: "bg-pink-950/5 dark:bg-pink-400/5",
    },
    yellow: {
      text: "text-yellow-600 dark:text-yellow-400",
      glow: "drop-shadow-[0_0_2px_rgba(202,138,4,0.8)] dark:drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]",
      border: "border-yellow-600/30 dark:border-yellow-400/30",
      bg: "bg-yellow-950/5 dark:bg-yellow-400/5",
    },
    white: {
      text: "text-neutral-600 dark:text-neutral-100",
      glow: "drop-shadow-[0_0_2px_rgba(82,82,82,0.8)] dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]",
      border: "border-neutral-600/30 dark:border-neutral-400/30",
      bg: "bg-neutral-950/5 dark:bg-neutral-400/5",
    },
    primary: {
      text: "text-primary dark:text-primary",
      glow: "drop-shadow-[0_0_2px_rgba(var(--primary),0.8)] dark:drop-shadow-[0_0_5px_rgba(var(--primary),0.8)]",
      border: "border-primary/30",
      bg: "bg-primary/5",
    },
  };

  const styles = colorStyles[color];

  return (
    <motion.div
      className={cn(
        "relative inline-flex items-center justify-center select-none backdrop-blur-[1px]",
        styles.bg,
        className
      )}
      animate={{
        opacity: isFlickering ? 0.7 : 1,
      }}
      transition={{ duration: 0.05 }}
    >
      <span
        className={cn(
          "relative z-10 transition-all duration-200",
          styles.text,
          !isFlickering && styles.glow
        )}
        style={{
          textShadow:
            !isFlickering && intensity === "high"
              ? "0 0 10px currentColor"
              : "none",
        }}
      >
        {text}
      </span>
    </motion.div>
  );
};

// -----------------------------------------------------------------------------
// Wireframe Gym Storefront SVG
// -----------------------------------------------------------------------------

const WireframeStorefront = () => {
  return (
    <svg
      viewBox="0 0 800 400"
      className="w-full h-full absolute inset-0 pointer-events-none stroke-foreground/10 dark:stroke-foreground/20"
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
            className="stroke-foreground/5 dark:stroke-foreground/10"
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
          <path
            d="M0 10 L40 10"
            fill="none"
            strokeWidth="1"
            className="stroke-foreground/10 dark:stroke-foreground/20"
          />
        </pattern>
      </defs>
      {/* --- Left Building (Shutter) --- */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <rect
          x="0"
          y="50"
          width="250"
          height="350"
          fill="none"
          strokeWidth="2"
        />
        {/* Roller Shutter Box */}
        <rect
          x="20"
          y="70"
          width="210"
          height="40"
          fill="none"
          strokeWidth="2"
        />
        <rect
          x="25"
          y="75"
          width="10"
          height="30"
          fill="none"
          strokeWidth="1"
        />
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
        <rect
          x="230"
          y="80"
          width="15"
          height="20"
          fill="none"
          strokeWidth="1"
        />
      </motion.g>

      {/* --- Center Building (Entrance) --- */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
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
          className="fill-background/50"
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
          className="text-[10px] font-mono fill-foreground/40"
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
      </motion.g>

      {/* --- Right Building (Lockers/Wall) --- */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
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
      </motion.g>
    </svg>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------

export function GymNeonShowcase() {
  return (
    <div className="w-full relative bg-background border-y border-border overflow-hidden h-[500px]">
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-dots opacity-10 dark:opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

      <div className="relative w-full max-w-5xl mx-auto h-full flex items-center justify-center">
        {/* Architectural Wireframe Layer */}
        <div className="absolute inset-0 z-0 scale-90 md:scale-100 transition-transform duration-500">
          <WireframeStorefront />
        </div>

        {/* Neon Signs Layer */}

        {/* Main Sign */}
        <div className="absolute top-[12%] left-[50%] transform -translate-x-[65%] z-10">
          <NeonText
            text="IRON GYM"
            color="yellow"
            className="text-4xl md:text-6xl font-black tracking-tighter font-sans border-4 border-yellow-500/20 dark:border-yellow-500/10 px-6 py-3 rounded-xl shadow-2xl"
          />
        </div>

        {/* Side Sign (Open 24/7) */}
        <div className="absolute top-[45%] left-[35%] z-10">
          <div className="flex flex-col items-center gap-1">
            <NeonText
              text="OPEN 24/7"
              color="white"
              className="text-[10px] md:text-xs font-mono tracking-widest px-2 py-1 border border-neutral-500/20 rounded"
              intensity="low"
              flicker={false}
            />
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
          </div>
        </div>

        {/* Window Neon 1 */}
        <div className="absolute top-[50%] left-[55%] z-10 rotate-[-10deg]">
          <NeonText
            text="NO PAIN"
            color="pink"
            className="text-xl md:text-2xl font-bold font-mono border-2 border-pink-500/20 px-3 py-1 rounded-lg"
            intensity="medium"
          />
        </div>

        {/* Window Neon 2 */}
        <div className="absolute top-[60%] left-[58%] z-10 rotate-[-5deg]">
          <NeonText
            text="NO GAIN"
            color="cyan"
            className="text-xl md:text-2xl font-bold font-mono border-2 border-cyan-500/20 px-3 py-1 rounded-lg"
            intensity="medium"
          />
        </div>

        {/* Address Number */}
        <div className="absolute top-[15%] left-[32%] z-0 opacity-40">
          <span className="text-sm font-mono text-foreground">73</span>
        </div>
      </div>

      {/* Overlay Gradient for Depth */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/80 via-transparent to-background/20" />
    </div>
  );
}
