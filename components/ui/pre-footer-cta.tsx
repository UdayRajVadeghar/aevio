"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Link from "next/link";
import React from "react";

export function PreFooterCTA() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rafRef = React.useRef<number>();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Throttle with requestAnimationFrame for better performance
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      const { left, top } = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - left);
      mouseY.set(e.clientY - top);
    });
  };

  React.useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Mask for the glow effect
  const maskImage = useMotionTemplate`radial-gradient(circle 300px at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <section className="relative w-full bg-white dark:bg-black py-32 md:py-48 overflow-hidden flex flex-col items-center justify-center gap-16 md:gap-24">
      {/* Button Section - Moved Above */}
      <div className="relative z-20 flex items-center justify-center">
        {/* Crosshairs - Fixed length or viewport based? 
            Original requirement: "design this exact right above the footer section" 
            The previous crosshairs were full screen. Let's keep them large but centered on the button.
        */}
        <div className="absolute h-[200vh] w-[1px] bg-black/10 dark:bg-white/10 top-1/2 -translate-y-1/2 pointer-events-none left-1/2 -translate-x-1/2" />
        <div className="absolute w-[200vw] h-[1px] bg-black/10 dark:bg-white/10 left-1/2 -translate-x-1/2 pointer-events-none top-1/2 -translate-y-1/2" />

        {/* The Button */}
        <div className="relative bg-black dark:bg-white px-8 py-4 group cursor-pointer transition-transform active:scale-95">
          <Link
            href="/authentication?view=signup"
            className="block text-white dark:text-black font-medium text-base md:text-lg whitespace-nowrap tracking-tight"
          >
            Start creating
          </Link>

          {/* Corner accents */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-black/20 dark:border-white/20" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-black/20 dark:border-white/20" />

          {/* Button internal hover glow */}
          <div className="absolute inset-0 bg-white/20 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </div>

      {/* Text Section with Interactive Glow */}
      <div
        className="relative z-10 select-none flex items-center justify-center w-full cursor-default [--stroke-color:rgba(0,0,0,0.1)] dark:[--stroke-color:rgba(255,255,255,0.1)]"
        onMouseMove={handleMouseMove}
      >
        <div className="relative">
          {/* Base Outlined Text */}
          <h1
            className="text-[15vw] md:text-[18vw] font-bold leading-none tracking-tighter text-center text-transparent"
            style={{
              WebkitTextStroke: "1px var(--stroke-color)",
              fontFamily: "var(--font-sans)",
            }}
          >
            AEVIO
          </h1>

          {/* Glowing Filled Text (Masked) */}
          <motion.div
            className="absolute inset-0 text-[15vw] md:text-[18vw] font-bold leading-none tracking-tighter text-center text-black dark:text-white pointer-events-none"
            style={{
              WebkitMaskImage: maskImage,
              maskImage: maskImage,
              fontFamily: "var(--font-sans)",
              willChange: "mask-image, -webkit-mask-image",
            }}
          >
            AEVIO
          </motion.div>
        </div>
      </div>
    </section>
  );
}
