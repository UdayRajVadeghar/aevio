"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const AsciiHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const chars = ["^", "/", "\\", ".", "*"];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      time += 0.01;
      ctx.fillStyle = "#000000"; // Black background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const fontSize = 14;
      const columns = Math.ceil(canvas.width / fontSize);
      const rows = Math.ceil(canvas.height / fontSize);

      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Center of the screen
      const cx = columns / 2;
      const cy = rows / 2;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          // Normalize coordinates to -1.5 to 1.5 for the heart shape
          // Adjust aspect ratio
          const aspect = canvas.width / canvas.height;
          const nx = (x - cx) / (columns / 3) * aspect;
          const ny = (y - cy) / (rows / 3) * -1; // Flip Y for correct orientation

          // Heart formula: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
          // Adding some noise/time for the "living" effect
          const noise = Math.sin(x * 0.1 + time) * Math.cos(y * 0.1 + time) * 0.2;
          
          // Doctor/Cross silhouette approximation (optional, subtle)
          // Let's stick to a detailed, morphing heart which is the core request
          
          const a = nx * nx + ny * ny - 1;
          const isHeart = a * a * a - nx * nx * ny * ny * ny + noise * 0.5 < 0;

          if (isHeart) {
            // Select character based on noise/position
            const charIndex = Math.floor((Math.sin(x * y + time * 2) + 1) * 2.5) % chars.length;
            const char = chars[charIndex];

            // Color: Dark grey to white gradient based on "depth" or noise
            const brightness = Math.floor(Math.abs(noise) * 100 + 50);
            ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 0.8)`;
            
            // Draw character
            ctx.fillText(char, x * fontSize, y * fontSize);
          } else {
            // Background noise (very subtle)
            if (Math.random() > 0.995) {
               ctx.fillStyle = "rgba(30, 30, 30, 0.5)";
               ctx.fillText(".", x * fontSize, y * fontSize);
            }
          }
        }
      }

      // Overlay scanlines or dither effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.fillRect(0, i, canvas.width, 2);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-black text-white overflow-hidden flex items-center justify-center">
      {/* ASCII Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40 pointer-events-none"
      />
      
      {/* Radial Gradient Overlay to focus center */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/50 to-black pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 10%, black 90%)' }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Pill Label */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-8 border border-white/20 bg-white/5 backdrop-blur-sm text-[10px] uppercase tracking-[0.2em] font-mono text-white/70"
        >
          <span className="w-1 h-1 bg-emerald-500 rounded-none" /> {/* Sharp dot */}
          Introducing Aevio
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-light tracking-tight leading-[0.9] mb-8"
        >
          Your intelligent path <br />
          <span className="italic text-white/80">to better health.</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-base md:text-lg text-neutral-400 max-w-lg mx-auto mb-12 leading-relaxed font-light tracking-wide"
        >
          Track workouts, journal your mind, and analyze your heart health — powered by AI.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <Link
            href="/authentication?view=signup"
            className="group relative px-8 py-4 bg-white text-black font-medium text-sm hover:bg-neutral-200 transition-all min-w-[160px] flex items-center justify-center gap-2"
          >
            <span className="relative z-10">Start Tracking</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <button className="group px-8 py-4 border border-white/20 text-white font-medium text-sm hover:bg-white/5 transition-all min-w-[160px]">
            Read Manifesto
          </button>
        </motion.div>
      </div>

      {/* Decorative Corners */}
      <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-white/30" />
      <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-white/30" />
      <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-white/30" />
      <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-white/30" />

    </section>
  );
};

