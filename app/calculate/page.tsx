"use client";

import { Button } from "@/components/ui/shadcn/button";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Scan,
  Utensils,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useRef, useState } from "react";

type Stage =
  | "idle"
  | "preview"
  | "confirmed"
  | "analyzing"
  | "result"
  | "error";

type FoodItem = { name: string; portion: string; calories: number };

type AnalyzeResult = {
  id: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foodItems: FoodItem[];
  confidence: "low" | "medium" | "high";
  llmResponse: string;
};

function formatLlmResponse(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}

export default function CalculatePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [subStatus, setSubStatus] = useState<"Uploading…" | "Analyzing…">(
    "Uploading…",
  );
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleCapture = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (!f) return;
      const url = URL.createObjectURL(f);
      setImageUrl(url);
      setFile(f);
      setStage("preview");
      e.target.value = "";
    },
    [],
  );

  const openCamera = () => fileInputRef.current?.click();

  const retake = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setFile(null);
    setStage("idle");
    setTimeout(() => fileInputRef.current?.click(), 100);
  };

  const confirm = () => setStage("confirmed");

  const reset = () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    setFile(null);
    setResult(null);
    setErrorMessage("");
    setStage("idle");
  };

  const analyze = useCallback(async () => {
    if (!file) return;
    setStage("analyzing");
    setSubStatus("Uploading…");
    setErrorMessage("");

    // Flip to "Analyzing…" after a short delay so the user sees progress
    // even though the backend response is a single round-trip.
    const flipTimer = window.setTimeout(() => setSubStatus("Analyzing…"), 1500);

    const fd = new FormData();
    fd.append("image", file);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Request failed (${res.status})`);
      }
      const data = (await res.json()) as AnalyzeResult;
      setResult(data);
      setStage("result");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setStage("error");
    } finally {
      window.clearTimeout(flipTimer);
    }
  }, [file]);

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
                  const f = e.dataTransfer.files?.[0];
                  if (f && f.type.startsWith("image/")) {
                    const url = URL.createObjectURL(f);
                    setImageUrl(url);
                    setFile(f);
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
                <Button
                  onClick={analyze}
                  disabled={!file}
                  className="flex-1 rounded-xl h-12 gap-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 font-semibold shadow-md"
                >
                  Proceed
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {stage === "analyzing" && imageUrl && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md"
            >
              <div className="relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-black/5 dark:shadow-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Analyzing"
                  className="w-full object-cover opacity-60"
                  style={{ maxHeight: "400px" }}
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
                  >
                    <Loader2 className="w-7 h-7 text-neutral-800 animate-spin" />
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-4 flex items-center gap-3"
              >
                <Loader2 className="w-4 h-4 text-neutral-500 animate-spin shrink-0" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={subStatus}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      {subStatus}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">
                      {subStatus === "Uploading…"
                        ? "Sending your photo securely to the server."
                        : "Gemini is identifying food items and estimating macros."}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {stage === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md"
            >
              <div className="relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-black/5 dark:shadow-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.imageUrl}
                  alt="Analyzed meal"
                  className="w-full object-cover"
                  style={{ maxHeight: "320px" }}
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Analysis complete
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-neutral-800 text-xs font-mono uppercase tracking-wider">
                  {result.confidence}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 p-5">
                <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                  Total calories
                </p>
                <p className="text-4xl font-bold tracking-tighter text-neutral-950 dark:text-neutral-50 mt-1">
                  {Math.round(result.calories)}
                  <span className="text-base font-normal text-neutral-500 ml-1.5">
                    kcal
                  </span>
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {(
                    [
                      { label: "Protein", value: result.protein },
                      { label: "Carbs", value: result.carbs },
                      { label: "Fat", value: result.fat },
                    ] as const
                  ).map((m) => (
                    <div
                      key={m.label}
                      className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 text-center"
                    >
                      <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                        {m.label}
                      </p>
                      <p className="text-lg font-semibold text-neutral-950 dark:text-neutral-50 mt-0.5">
                        {Math.round(m.value)}
                        <span className="text-xs font-normal text-neutral-500 ml-0.5">
                          g
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {result.foodItems.length > 0 && (
                <div className="mt-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
                  <div className="px-5 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                    <Utensils className="w-3.5 h-3.5 text-neutral-500" />
                    <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                      Items detected
                    </p>
                  </div>
                  <ul className="divide-y divide-neutral-200 dark:divide-neutral-800">
                    {result.foodItems.map((item, i) => (
                      <li
                        key={i}
                        className="px-5 py-3 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-neutral-500 truncate">
                            {item.portion}
                          </p>
                        </div>
                        <p className="text-sm font-mono tabular-nums text-neutral-700 dark:text-neutral-300 shrink-0">
                          {Math.round(item.calories)} kcal
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
                <div className="px-5 py-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
                  <Scan className="w-3.5 h-3.5 text-neutral-500" />
                  <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                    LLM response
                  </p>
                </div>
                <pre className="max-h-80 overflow-auto px-5 py-4 text-[11px] leading-5 text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap break-words">
                  {formatLlmResponse(result.llmResponse)}
                </pre>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                <Button
                  onClick={reset}
                  className="w-full rounded-xl h-12 gap-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 font-semibold shadow-md"
                >
                  Analyze another
                  <Camera className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {stage === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md"
            >
              <div className="rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 p-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                      Analysis failed
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-400 break-words">
                      {errorMessage || "Something went wrong. Please retry."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  variant="outline"
                  onClick={reset}
                  className="flex-1 rounded-xl h-12 gap-2 border-neutral-200 dark:border-neutral-800"
                >
                  <XCircle className="w-4 h-4" />
                  Start over
                </Button>
                <Button
                  onClick={() => {
                    setStage("confirmed");
                    setErrorMessage("");
                  }}
                  disabled={!file}
                  className="flex-1 rounded-xl h-12 gap-2 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
