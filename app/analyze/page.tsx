"use client";

import { NeuralDiagnosticsDialog } from "@/components/analyze/neural-diagnostics-dialog";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Brain,
  Camera,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Lock,
  RefreshCw,
  Scan,
  Utensils,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/shadcn/dialog";
import Link from "next/link";

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

type SignedUploadResponse = {
  uploadUrl: string;
  objectKey: string;
  method: "PUT";
  headers: {
    "Content-Type": string;
  };
};

const MAX_MEAL_HINT_LENGTH = 180;
const ANALYZE_STREAM_TERMS = [
  "EXTRACTING_FEATURES...",
  "QUANTIZING_VECTORS...",
  "NEURAL_SYNC_ACTIVE",
  "CALIBRATING_PIXELS...",
  "NORMALIZING_INPUT...",
  "MATRIX_TRACE_OK",
];

const generateDataStreamEntries = (count: number) => {
  return Array.from({ length: count }, (_, index) => {
    if (index % 3 === 0) {
      const length = 16 + Math.floor(Math.random() * 10);
      return Array.from({ length }, () => (Math.random() > 0.5 ? "1" : "0")).join("");
    }
    return ANALYZE_STREAM_TERMS[index % ANALYZE_STREAM_TERMS.length];
  });
};

export default function CalculatePage() {
  const shouldReduceMotion = useReducedMotion();
  const { data: session, isPending } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [mealHint, setMealHint] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [subStatus, setSubStatus] = useState<"Uploading…" | "Analyzing…">(
    "Uploading…",
  );
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const trimmedMealHint = mealHint.trim();
  const isActiveStage = stage !== "idle";
  const captureStageClass = "w-full max-w-5xl";
  const captureStageGridClass =
    "grid grid-cols-1 items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)] lg:gap-8";
  const captureMediaFrameClass =
    "relative overflow-hidden border border-black bg-neutral-100/80 p-4 dark:border-white dark:bg-neutral-950/80 sm:p-6";
  const captureMediaInnerClass =
    "relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-[28px] border border-black/10 bg-white px-4 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:border-white/10 dark:bg-black/40";
  const captureImageClass =
    "block h-auto max-h-[min(62vh,540px)] w-auto max-w-full object-contain";
  const analyzingDataStream = useMemo(
    () => (stage === "analyzing" ? generateDataStreamEntries(100) : []),
    [stage, imageUrl],
  );
  const confidenceToneClass = result
    ? {
        high: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-200 dark:border-emerald-400/40",
        medium:
          "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/20 dark:text-amber-200 dark:border-amber-400/40",
        low: "bg-red-100 text-red-800 border-red-300 dark:bg-red-500/20 dark:text-red-200 dark:border-red-400/40",
      }[result.confidence]
    : "";

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

  const openCamera = () => {
    if (!isPending && !session?.user) {
      setIsAuthDialogOpen(true);
      return;
    }
    fileInputRef.current?.click();
  };

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
    setMealHint("");
    setResult(null);
    setErrorMessage("");
    setIsDiagnosticsOpen(false);
    setStage("idle");
  };

  const analyze = useCallback(async () => {
    if (!file) return;
    setStage("analyzing");
    setSubStatus("Uploading…");
    setErrorMessage("");

    try {
      const uploadTargetRes = await fetch("/api/analyze/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mimeType: file.type,
          fileSize: file.size,
        }),
      });
      if (!uploadTargetRes.ok) {
        const body = await uploadTargetRes.json().catch(() => ({}));
        throw new Error(
          body?.error ?? `Failed to initialize upload (${uploadTargetRes.status})`,
        );
      }

      const uploadTarget = (await uploadTargetRes.json()) as SignedUploadResponse;
      const uploadRes = await fetch(uploadTarget.uploadUrl, {
        method: uploadTarget.method,
        headers: uploadTarget.headers,
        body: file,
      });
      if (!uploadRes.ok) {
        throw new Error(`Upload failed (${uploadRes.status})`);
      }

      setSubStatus("Analyzing…");
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectKey: uploadTarget.objectKey,
          mimeType: file.type,
          mealHint: trimmedMealHint || undefined,
        }),
      });
      if (!analyzeRes.ok) {
        const body = await analyzeRes.json().catch(() => ({}));
        throw new Error(body?.error ?? `Request failed (${analyzeRes.status})`);
      }

      const data = (await analyzeRes.json()) as AnalyzeResult;
      setResult(data);
      setStage("result");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
      setStage("error");
    }
  }, [file, trimmedMealHint]);

  return (
    <main className="relative min-h-screen overflow-x-hidden [overflow-anchor:none] bg-white font-sans text-black selection:bg-black selection:text-white dark:bg-black dark:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Ambient glassmorphism background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className="hidden md:block absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-neutral-200/50 dark:bg-neutral-800/20 rounded-full blur-[120px] transform-gpu" />
        <div className="hidden md:block absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-neutral-200/50 dark:bg-neutral-800/20 rounded-full blur-[100px] transform-gpu" />
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

      <div
        className={cn(
          "relative z-10 flex min-h-screen flex-col items-center px-6",
          isActiveStage
            ? "justify-start pt-20 pb-10 sm:pt-24 sm:pb-12"
            : "justify-center pt-20 pb-12 sm:pt-24 sm:pb-16",
        )}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "flex flex-col items-center text-center",
            isActiveStage ? "mb-6 sm:mb-8" : "mb-8",
          )}
        >
         
          <h1
            className={cn(
              "mb-3 sm:mb-4 font-bold tracking-tighter leading-tight",
              isActiveStage
                ? "text-3xl sm:text-4xl md:text-5xl"
                : "text-4xl sm:text-5xl md:text-6xl",
            )}
          >
            CAPTURE & <br className="sm:hidden" /> CALCULATE
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
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
                  if (!isPending && !session?.user) {
                    setIsAuthDialogOpen(true);
                    return;
                  }
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
                  className={cn(
                    "absolute inset-x-0 h-[2px] bg-black/20 dark:bg-white/20",
                    !shouldReduceMotion && "animate-[slideIn_2.5s_ease-in-out_infinite]"
                  )}
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

          {(stage === "preview" || stage === "confirmed" || stage === "analyzing") && imageUrl && (
            <motion.div
              key="capture-stage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={captureStageClass}
            >
              <div className={captureStageGridClass}>
                {/* Left Column (Persistent) */}
                <div className="flex flex-col">
                  <div className={captureMediaFrameClass}>
                    <div className={captureMediaInnerClass}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt="Captured Media"
                        className={cn(
                          captureImageClass,
                          stage === "confirmed" && "opacity-60 grayscale",
                          stage === "analyzing" && "opacity-40 grayscale"
                        )}
                        style={stage === "preview" ? { filter: "grayscale(12%) contrast(1.03)" } : undefined}
                      />
                      
                      <AnimatePresence>
                        {stage === "preview" && (
                          <motion.div key="preview-badge" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute top-6 left-6 flex items-center gap-2 border border-white/20 bg-black px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-white">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                            Signal Acquired
                          </motion.div>
                        )}
                        
                        {stage === "confirmed" && (
                          <motion.div key="confirmed-success" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                              className="flex h-16 w-16 items-center justify-center border border-black bg-white text-black dark:border-white dark:bg-black dark:text-white"
                            >
                              <CheckCircle2 className="w-8 h-8" />
                            </motion.div>
                          </motion.div>
                        )}

                        {stage === "analyzing" && (
                          <motion.div key="analyzing-scan" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <motion.div
                                animate={shouldReduceMotion ? {} : { rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="h-16 w-16 rounded-full border border-white/20 border-t-white"
                              />
                              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                <Loader2 className="h-6 w-6 animate-spin text-white" aria-hidden />
                              </div>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 flex h-12 flex-col justify-end overflow-hidden text-[8px] font-mono uppercase text-white/50">
                              <motion.div
                                animate={shouldReduceMotion ? {} : { y: ["0%", "-50%"] }}
                                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                                className="space-y-1"
                              >
                                {[...analyzingDataStream, ...analyzingDataStream].map(
                                  (entry, index) => (
                                    <div key={`${entry}-${index}`}>{entry}</div>
                                  ),
                                )}
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Right Column (Transitions) */}
                <div className="flex h-full flex-col justify-center">
                  <AnimatePresence mode="wait">
                    {stage === "preview" && (
                      <motion.div key="right-preview" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                        <div className="border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/5 p-5 text-center">
                          <p className="text-sm font-bold tracking-tight mb-1 uppercase">Verify Capture</p>
                          <p className="text-xs text-neutral-500 font-mono">Ensure subject clarity before proceeding.</p>
                        </div>
                        <div className="flex gap-4">
                          <button onClick={retake} className="flex-1 px-6 py-3 border border-black dark:border-white text-black dark:text-white font-medium text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs">
                            <RefreshCw className="w-3.5 h-3.5" />
                            Discard
                          </button>
                          <button onClick={confirm} className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs">
                            Confirm
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                    
                    {stage === "confirmed" && (
                      <motion.div key="right-confirmed" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                        <div className="border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/5 p-5 text-center">
                          <p className="text-sm font-bold tracking-tight mb-1 uppercase">Data Locked</p>
                          <p className="text-xs text-neutral-500 font-mono">Neural engine standing by for analysis.</p>
                        </div>
                        <div className="border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/5 p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold tracking-tight uppercase">Known Meal Details</p>
                              <p className="text-xs text-neutral-500 font-mono mt-1">Optional. Add the item name, brand, or amount if you already know it.</p>
                            </div>
                            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 shrink-0">Optional</p>
                          </div>
                          <textarea
                            value={mealHint}
                            onChange={(e) => setMealHint(e.target.value)}
                            rows={2}
                            maxLength={MAX_MEAL_HINT_LENGTH}
                            placeholder="McDonald's Double Cheeseburger, 1 burger"
                            className="mt-4 w-full resize-none border border-black/10 dark:border-white/10 bg-white dark:bg-black px-4 py-3 text-sm text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white"
                          />
                          <div className="mt-2 flex items-center justify-between gap-3 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                            <p>Used only to improve estimate accuracy</p>
                            <p>{mealHint.length}/{MAX_MEAL_HINT_LENGTH}</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <button onClick={reset} className="px-4 py-3 text-neutral-500 hover:text-black dark:hover:text-white transition-colors flex items-center justify-center gap-2 uppercase tracking-wider text-xs">
                            <XCircle className="w-3.5 h-3.5" />
                            Abort
                          </button>
                          <button onClick={analyze} disabled={!file} className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-xs">
                            Execute Analysis
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {stage === "analyzing" && (
                      <motion.div key="right-analyzing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/5 p-5 text-center flex flex-col items-center justify-center min-h-[120px] gap-2">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={subStatus}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p className="text-sm font-bold tracking-tight uppercase">{subStatus.toUpperCase()}</p>
                            <p className="text-[10px] text-neutral-500 font-mono mt-1 uppercase tracking-widest">
                              {subStatus === "Uploading…" ? "Establishing secure uplink" : "Processing biological data"}
                            </p>
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {stage === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full max-w-4xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* Left Column */}
                <div className="flex flex-col gap-6 h-full">
                  <div className="relative overflow-hidden border border-black dark:border-white flex-1 min-h-[300px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.imageUrl}
                      alt="Analyzed meal"
                      className="absolute inset-0 w-full h-full object-contain"
                      style={{ filter: "contrast(1.1) saturate(0.8)" }}
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-black text-white text-[10px] font-mono uppercase tracking-widest border border-white/20">
                      Analysis Complete
                    </div>
                    <div
                      className={cn(
                        "absolute top-4 right-4 px-2 py-1 text-[10px] font-mono uppercase tracking-widest border",
                        confidenceToneClass,
                      )}
                    >
                      Conf: {result.confidence.toUpperCase()}
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <button
                      onClick={reset}
                      className="w-full px-6 py-4 bg-black dark:bg-white text-white dark:text-black font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                    >
                      <Scan className="w-4 h-4" />
                      New Analysis
                    </button>
                  </motion.div>
                </div>

                {/* Right Column */}
                <div className="flex flex-col gap-6 h-full">
                  <div className="border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/5 p-6 text-center">
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
                    <div className="border border-black/10 dark:border-white/10">
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

                  <div className="border border-black/10 dark:border-white/10 bg-white dark:bg-black">
                    <button
                      type="button"
                      onClick={() => setIsDiagnosticsOpen(true)}
                      className="w-full px-5 py-3 flex items-center justify-between border-b border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Brain className="w-3 h-3 shrink-0" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#A8906D]">
                          How we calculated this
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" aria-hidden />
                    </button>
                  </div>
                </div>
              </div>
              <NeuralDiagnosticsDialog
                open={isDiagnosticsOpen}
                onOpenChange={setIsDiagnosticsOpen}
                llmResponse={result.llmResponse}
                snapshot={{
                  confidence: result.confidence,
                  calories: result.calories,
                  protein: result.protein,
                  carbs: result.carbs,
                  fat: result.fat,
                }}
              />
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

      <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <DialogContent
          className="sm:max-w-[400px] p-0 overflow-hidden border border-border/50 bg-background/95 backdrop-blur-3xl shadow-[0_10px_40px_rgb(0,0,0,0.12)] dark:shadow-[0_10px_40px_rgb(0,0,0,0.4)] rounded-[28px]"
        >
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Lock className="w-7 h-7 text-primary" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold tracking-tight mb-2">
                Sign in to continue
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground leading-relaxed">
                Please log in or create an account to use the Aevio Engine and analyze your meals.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-8 w-full flex flex-col gap-3">
              <Link href="/authentication" className="w-full block">
                <button className="w-full h-12 bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 rounded-xl cursor-pointer shadow-sm">
                  Log in to continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <button 
                onClick={() => setIsAuthDialogOpen(false)}
                className="w-full h-12 bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors flex items-center justify-center rounded-xl font-medium cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
