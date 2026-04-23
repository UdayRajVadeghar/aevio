"use client";

import { Button } from "@/components/ui/shadcn/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  RefreshCw,
  Scan,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useRef, useState } from "react";

type Stage = "idle" | "preview" | "confirmed";

export default function CalculatePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleCapture = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setStage("preview");
      // reset input so same file can be re-selected
      e.target.value = "";
    },
    [],
  );

  const openCamera = () => fileInputRef.current?.click();

  const retake = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setStage("idle");
    // small delay so the input is ready
    setTimeout(() => fileInputRef.current?.click(), 100);
  };

  const confirm = () => setStage("confirmed");

  const reset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setStage("idle");
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-black overflow-hidden selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Ambient gradient orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.7 0.15 285), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[500px] h-[400px] rounded-full opacity-10 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0.65 0.18 260), transparent 70%)",
        }}
      />

      {/* Hidden camera input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCapture}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-6">
            <Scan className="w-3 h-3" />
            AI Analysis
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tighter text-neutral-950 dark:text-neutral-50 leading-none mb-4">
            Capture &amp;{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.55 0.2 285), oklch(0.7 0.15 260))",
              }}
            >
              Calculate
            </span>
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-base sm:text-lg max-w-sm mx-auto">
            Snap a photo and let our AI do the heavy lifting instantly.
          </p>
        </motion.div>

        {/* Main card */}
        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md"
            >
              <button
                onClick={openCamera}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    const url = URL.createObjectURL(file);
                    setImageUrl(url);
                    setStage("preview");
                  }
                }}
                className={cn(
                  "group relative w-full aspect-[4/3] rounded-3xl border-2 border-dashed transition-all duration-300 overflow-hidden",
                  "flex flex-col items-center justify-center gap-5",
                  "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
                  isDragging
                    ? "border-neutral-400 dark:border-neutral-500 bg-neutral-50 dark:bg-neutral-900/80 scale-[1.02]"
                    : "border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900/60",
                )}
              >
                {/* Subtle grid overlay */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
                  style={{
                    backgroundImage:
                      "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />

                {/* Scanning line animation */}
                <div
                  aria-hidden
                  className="absolute inset-x-4 h-px bg-gradient-to-r from-transparent via-neutral-400/50 dark:via-neutral-500/50 to-transparent animate-[slideIn_2.5s_ease-in-out_infinite]"
                />

                {/* Corner brackets */}
                {[
                  "top-4 left-4 border-t-2 border-l-2 rounded-tl-xl",
                  "top-4 right-4 border-t-2 border-r-2 rounded-tr-xl",
                  "bottom-4 left-4 border-b-2 border-l-2 rounded-bl-xl",
                  "bottom-4 right-4 border-b-2 border-r-2 rounded-br-xl",
                ].map((cls, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className={cn(
                      "absolute w-6 h-6 border-neutral-300 dark:border-neutral-700 transition-colors duration-300 group-hover:border-neutral-500 dark:group-hover:border-neutral-400",
                      cls,
                    )}
                  />
                ))}

                {/* Icon */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full blur-lg bg-neutral-200 dark:bg-neutral-700 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative w-16 h-16 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
                      <Camera className="w-7 h-7 text-neutral-700 dark:text-neutral-300 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Tap to open camera
                    </p>
                    <p className="text-xs text-neutral-400 dark:text-neutral-600 mt-1">
                      or drop an image here
                    </p>
                  </div>
                </div>
              </button>

              {/* Hint strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-400 dark:text-neutral-600"
              >
                <Zap className="w-3 h-3" />
                <span>Results in under 3 seconds</span>
              </motion.div>
            </motion.div>
          )}

          {stage === "preview" && imageUrl && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md"
            >
              {/* Image preview */}
              <div className="relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-black/5 dark:shadow-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Captured"
                  className="w-full object-cover"
                  style={{ maxHeight: "400px" }}
                />
                {/* Overlay badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Image captured
                </div>
              </div>

              {/* Confirmation prompt */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-4"
              >
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
                  Does this look good?
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-500">
                  Make sure the subject is clearly visible, well-lit, and in
                  frame before proceeding.
                </p>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 flex gap-3"
              >
                <Button
                  variant="outline"
                  onClick={retake}
                  className="flex-1 rounded-xl h-12 gap-2 border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retake
                </Button>
                <Button
                  onClick={confirm}
                  className="flex-1 rounded-xl h-12 gap-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100"
                >
                  Looks good
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {stage === "confirmed" && imageUrl && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md"
            >
              {/* Confirmed image */}
              <div className="relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-black/5 dark:shadow-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Confirmed"
                  className="w-full object-cover opacity-80"
                  style={{ maxHeight: "400px" }}
                />
                {/* Success overlay */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.1,
                    }}
                    className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
                  >
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </motion.div>
                </div>
              </div>

              {/* Ready state */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 p-4 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    Image confirmed
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-500">
                    Ready to analyze — proceed when you are.
                  </p>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mt-4 flex gap-3"
              >
                <Button
                  variant="ghost"
                  onClick={reset}
                  className="gap-2 rounded-xl h-12 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 px-4"
                >
                  <XCircle className="w-4 h-4" />
                  Start over
                </Button>
                <Button className="flex-1 rounded-xl h-12 gap-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 font-semibold shadow-md">
                  Proceed
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
