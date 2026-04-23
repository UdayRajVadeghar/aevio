"use client";

import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Brain,
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

type FoodItem = {
  name: string;
  quantity: number;
  portion: string;
  caloriesPerUnit: number;
  calories: number;
};

type PlateContents = {
  referenceObject: "credit_card";
  items: FoodItem[];
};

type AnalyzeResult = {
  id: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foodItems: FoodItem[];
  plateContents: PlateContents;
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
    <main className="relative min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-hidden selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black font-sans">
      {/* Ambient glassmorphism background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-neutral-200/50 dark:bg-neutral-800/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-neutral-200/50 dark:bg-neutral-800/20 rounded-full blur-[100px]" />
      </div>

      {/* Hidden camera input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCapture}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 border border-black dark:border-white px-3 py-1 text-xs font-mono uppercase tracking-widest mb-6 bg-white dark:bg-black">
            <Scan className="w-3 h-3" />
            AI Analysis
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-none mb-4">
            CAPTURE & <br className="sm:hidden" /> CALCULATE
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg max-w-md mx-auto leading-relaxed">
            Snap a photo and let the Aevio Engine decode your meal&apos;s metrics instantly.
          </p>
        </motion.div>

        {/* Main card */}
        <AnimatePresence mode="wait">
          {stage === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
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
                  "group relative w-full aspect-[4/3] border border-black dark:border-white transition-all duration-300 overflow-hidden",
                  "flex flex-col items-center justify-center gap-5",
                  "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white",
                  isDragging
                    ? "bg-neutral-100 dark:bg-neutral-900 scale-[1.02]"
                    : "bg-neutral-50/50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-neutral-900",
                )}
              >
                {/* Subtle grid overlay */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-[0.1] dark:opacity-[0.2]"
                  style={{
                    backgroundImage:
                      "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Scanning line animation */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 h-[2px] bg-black/20 dark:bg-white/20 animate-[slideIn_2.5s_ease-in-out_infinite]"
                />

                {/* Icon */}
                <div className="relative z-10 flex flex-col items-center gap-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm p-6 border border-black/10 dark:border-white/10">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-black dark:text-white group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <div className="text-center font-mono uppercase tracking-widest">
                    <p className="text-xs font-bold text-black dark:text-white">
                      Initialize Camera
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-1">
                      or drop image
                    </p>
                  </div>
                </div>
              </button>

              {/* Hint strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-neutral-500"
              >
                <Zap className="w-3 h-3" />
                <span>Processing latency &lt; 3s</span>
              </motion.div>
            </motion.div>
          )}

          {stage === "preview" && imageUrl && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-md"
            >
              {/* Image preview */}
              <div className="relative overflow-hidden border border-black dark:border-white bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Captured"
                  className="w-full object-cover"
                  style={{ maxHeight: "400px", filter: "grayscale(20%)" }}
                />
                {/* Overlay badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-mono uppercase tracking-widest border border-white/20">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  Signal Acquired
                </div>
              </div>

              {/* Confirmation prompt */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/5 p-5 text-center"
              >
                <p className="text-sm font-bold tracking-tight mb-1 uppercase">
                  Verify Capture
                </p>
                <p className="text-xs text-neutral-500 font-mono">
                  Ensure subject clarity before proceeding.
                </p>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 flex gap-4"
              >
                <button
                  onClick={retake}
                  className="flex-1 px-6 py-3 border border-black dark:border-white text-black dark:text-white font-medium text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Discard
                </button>
                <button
                  onClick={confirm}
                  className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
                >
                  Confirm
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            </motion.div>
          )}

          {stage === "confirmed" && imageUrl && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-md"
            >
              {/* Confirmed image */}
              <div className="relative overflow-hidden border border-black dark:border-white bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Confirmed"
                  className="w-full object-cover opacity-60 grayscale"
                  style={{ maxHeight: "400px" }}
                />
                {/* Success overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.1,
                    }}
                    className="w-16 h-16 bg-white dark:bg-black text-black dark:text-white flex items-center justify-center border border-black dark:border-white"
                  >
                    <CheckCircle2 className="w-8 h-8" />
                  </motion.div>
                </div>
              </div>

              {/* Ready state */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/5 p-5 text-center"
              >
                <p className="text-sm font-bold tracking-tight mb-1 uppercase">
                  Data Locked
                </p>
                <p className="text-xs text-neutral-500 font-mono">
                  Neural engine standing by for analysis.
                </p>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-4 flex gap-4"
              >
                <button
                  onClick={reset}
                  className="px-4 py-3 text-neutral-500 hover:text-black dark:hover:text-white transition-colors flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Abort
                </button>
                <button
                  onClick={analyze}
                  disabled={!file}
                  className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
                >
                  Execute Analysis
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            </motion.div>
          )}

          {stage === "analyzing" && imageUrl && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-md"
            >
              <div className="relative overflow-hidden border border-black dark:border-white bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Analyzing"
                  className="w-full object-cover opacity-40 grayscale"
                  style={{ maxHeight: "400px" }}
                />
                {/* Scanning overlay */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border border-white/20 border-t-white rounded-full"
                  />
                  <Loader2 className="absolute w-6 h-6 text-white animate-spin" />
                </div>
                {/* Data stream effect */}
                <div className="absolute bottom-4 left-4 right-4 h-12 overflow-hidden flex flex-col justify-end text-[8px] font-mono text-white/50 uppercase">
                  <motion.div
                    animate={{ y: [0, -20] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <div>101010111000101010</div>
                    <div>EXTRACTING_FEATURES...</div>
                    <div>QUANTIZING_VECTORS...</div>
                    <div>NEURAL_SYNC_ACTIVE</div>
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-6 border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/5 p-5 text-center flex flex-col items-center gap-2"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={subStatus}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-sm font-bold tracking-tight uppercase">
                      {subStatus.toUpperCase()}
                    </p>
                    <p className="text-[10px] text-neutral-500 font-mono mt-1 uppercase tracking-widest">
                      {subStatus === "Uploading…"
                        ? "Establishing secure uplink"
                        : "Processing biological data"}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}

          {stage === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-md"
            >
              <div className="relative overflow-hidden border border-black dark:border-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.imageUrl}
                  alt="Analyzed meal"
                  className="w-full object-cover"
                  style={{ maxHeight: "320px", filter: "contrast(1.1) saturate(0.8)" }}
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-[10px] font-mono uppercase tracking-widest border border-white/20">
                  Analysis Complete
                </div>
                <div className="absolute top-4 right-4 px-2 py-1 bg-white text-black text-[10px] font-mono uppercase tracking-widest border border-black/20">
                  Conf: {result.confidence.toUpperCase()}
                </div>
              </div>

              <div className="mt-6 border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/5 p-6 text-center">
                <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-2">
                  Total Energy Output
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <p className="text-6xl font-bold tracking-tighter">
                    {Math.round(result.calories)}
                  </p>
                  <span className="text-sm font-mono text-neutral-500 uppercase tracking-widest">
                    kcal
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-px bg-black/10 dark:bg-white/10">
                  {(
                    [
                      { label: "Protein", value: result.protein },
                      { label: "Carbs", value: result.carbs },
                      { label: "Fat", value: result.fat },
                    ] as const
                  ).map((m) => (
                    <div
                      key={m.label}
                      className="bg-white dark:bg-black p-4 flex flex-col items-center justify-center"
                    >
                      <p className="text-[9px] font-mono uppercase tracking-widest text-neutral-500 mb-1">
                        {m.label}
                      </p>
                      <p className="text-xl font-bold">
                        {Math.round(m.value)}
                        <span className="text-[10px] font-mono text-neutral-500 ml-0.5">
                          g
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {result.foodItems.length > 0 && (
                <div className="mt-6 border border-black/10 dark:border-white/10">
                  <div className="px-5 py-3 border-b border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/5 flex items-center justify-between gap-3">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                      <Utensils className="w-3 h-3" />
                      Detected Elements
                    </p>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                      Ref: {result.plateContents.referenceObject.replace("_", " ")}
                    </p>
                  </div>
                  <ul className="divide-y divide-black/10 dark:divide-white/10 bg-white dark:bg-black">
                    {result.foodItems.map((item, i) => (
                      <li
                        key={i}
                        className="px-5 py-4 flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold uppercase tracking-tight truncate">
                            {item.name}
                          </p>
                          <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-0.5 truncate">
                            Qty {item.quantity} • {Math.round(item.caloriesPerUnit)} kcal each • {item.portion}
                          </p>
                        </div>
                        <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 shrink-0">
                          {Math.round(item.calories)} kcal
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 border border-black/10 dark:border-white/10 bg-white dark:bg-black">
                <div className="px-5 py-3 border-b border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/5">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                    <Brain className="w-3 h-3" />
                    Neural Log
                  </p>
                </div>
                <pre className="max-h-64 overflow-auto px-5 py-4 text-[10px] font-mono leading-relaxed text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap break-words">
                  {formatLlmResponse(result.llmResponse)}
                </pre>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8"
              >
                <button
                  onClick={reset}
                  className="w-full px-6 py-4 bg-black dark:bg-white text-white dark:text-black font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  <Scan className="w-4 h-4" />
                  New Analysis
                </button>
              </motion.div>
            </motion.div>
          )}

          {stage === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-md"
            >
              <div className="border border-black dark:border-white bg-black text-white p-6 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center border border-white/20">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest mb-2">
                      System Failure
                    </p>
                    <p className="text-xs font-mono text-white/70">
                      {errorMessage || "Connection severed. Re-initialize sequence."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  onClick={reset}
                  className="flex-1 px-6 py-3 border border-black dark:border-white text-black dark:text-white font-medium text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
                >
                  Abort
                </button>
                <button
                  onClick={() => {
                    setStage("confirmed");
                    setErrorMessage("");
                  }}
                  disabled={!file}
                  className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
                >
                  Retry Uplink
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
