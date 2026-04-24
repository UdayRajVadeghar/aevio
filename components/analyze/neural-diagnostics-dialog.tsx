"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/shadcn/dialog";
import { cn } from "@/lib/utils";
import { Cpu, Network, Target } from "lucide-react";
import React, { useEffect, useMemo } from "react";

const accent = "text-[#A8906D] dark:text-[#C5AA82]";

type Snapshot = {
  confidence: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type NeuralDiagnosticsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  llmResponse: string;
  snapshot: Snapshot;
};

function renderNode(
  label: string,
  value: unknown,
  depth: number,
): React.ReactNode {
  if (typeof value === "object" && value !== null) {
    return (
      <div
        key={label}
        className={cn(
          "min-w-0 overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950",
          depth > 0 && "mt-3",
        )}
      >
        <p
          className={cn(
            "mb-3 text-[10px] font-mono font-bold uppercase tracking-[0.2em]",
            accent,
          )}
        >
          {label}
        </p>
        <div className="min-w-0 space-y-3 border-l-2 border-neutral-200 pl-4 dark:border-neutral-800">
          {Array.isArray(value)
            ? value.map((v, i) => (
                <div key={i}>{renderNode(`Item ${i + 1}`, v, depth + 1)}</div>
              ))
            : Object.entries(value as Record<string, unknown>).map(([k, v]) => (
                <div key={k}>{renderNode(k, v, depth + 1)}</div>
              ))}
        </div>
      </div>
    );
  }

  return (
    <div
      key={label}
      className="flex min-w-0 flex-col gap-1 border-b border-neutral-100 py-3 last:border-0 dark:border-neutral-800/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
    >
      <span className="shrink-0 text-xs font-medium text-neutral-500 dark:text-neutral-400">
        {label}
      </span>
      <span className="min-w-0 break-words text-left text-sm font-mono font-medium text-neutral-900 dark:text-neutral-100 sm:max-w-full sm:text-right">
        {String(value)}
      </span>
    </div>
  );
}

function ParsedDiagnostics({ raw }: { raw: string }) {
  const tree = useMemo(() => {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      return { ok: true as const, parsed };
    } catch {
      return { ok: false as const, raw };
    }
  }, [raw]);

  if (!tree.ok) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-900">
        <p className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Raw response
        </p>
        <p className="break-words font-mono text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          {tree.raw}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(tree.parsed).map(([k, v]) => (
        <div key={k}>{renderNode(k, v, 0)}</div>
      ))}
    </div>
  );
}

export function NeuralDiagnosticsDialog({
  open,
  onOpenChange,
  llmResponse,
  snapshot,
}: NeuralDiagnosticsDialogProps) {
  useEffect(() => {
    if (!open) return;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyOverscrollBehavior = body.style.overscrollBehavior;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "contain";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousBodyOverscrollBehavior;
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          "!flex min-h-0 max-h-[min(92dvh,56rem)] w-[calc(100vw-2rem)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:w-[min(96vw,72rem)] sm:!max-w-[72rem]",
          "rounded-3xl border border-neutral-200 bg-white shadow-2xl ring-1 ring-black/5",
          "dark:border-neutral-800 dark:bg-neutral-950 dark:ring-white/5",
        )}
      >
        <div className="shrink-0 border-b border-neutral-200 bg-neutral-50/50 px-6 py-5 dark:border-neutral-800 dark:bg-neutral-900/30 sm:px-8 sm:py-6">
          <DialogHeader className="gap-2 space-y-0 text-left">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
                <Cpu className={cn("size-6", accent)} strokeWidth={1.5} />
              </div>
              <div className="min-w-0 pr-6 sm:pr-0">
                <DialogTitle className="text-balance text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-2xl">
                  How your meal was analyzed
                </DialogTitle>
                <DialogDescription className="mt-1.5 text-pretty text-left text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Our AI looked at your photo to identify foods, estimate portion sizes, and calculate calories and macros. Here's the full breakdown.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div
          className={cn(
            "min-h-0 max-h-full flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain px-6 py-6 sm:px-8 sm:py-8",
            "touch-pan-y [overscroll-behavior:contain] [-webkit-overflow-scrolling:touch] bg-white dark:bg-neutral-950",
          )}
        >
          <div className="grid min-w-0 grid-cols-1 items-start gap-8 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)] lg:gap-12">
            
            {/* Left Column: At a Glance */}
            <section
              aria-labelledby="nd-snapshot-heading"
              className="min-w-0 flex flex-col gap-4"
            >
              <h3
                id="nd-snapshot-heading"
                className="flex items-center gap-2 text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100"
              >
                <Target className={cn("size-5", accent)} strokeWidth={2} />
                At a glance
              </h3>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                {[
                  { k: "Confidence", v: snapshot.confidence.toUpperCase() },
                  { k: "Calories", v: `${Math.round(snapshot.calories)} kcal` },
                  { k: "Protein", v: `${Math.round(snapshot.protein)} g` },
                  { k: "Carbs", v: `${Math.round(snapshot.carbs)} g` },
                  { k: "Fat", v: `${Math.round(snapshot.fat)} g` },
                ].map((row) => (
                  <div
                    key={row.k}
                    className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                      {row.k}
                    </p>
                    <p className="mt-1 text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
                      {row.v}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Right Column: Behind the numbers */}
            <section
              aria-labelledby="nd-structured-heading"
              className="min-w-0 flex flex-col gap-4"
            >
              <h3
                id="nd-structured-heading"
                className="flex items-center gap-2 text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100"
              >
                <Network className={cn("size-5", accent)} strokeWidth={2} />
                Behind the numbers
              </h3>
              <div className="min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/30 sm:p-6">
                <ParsedDiagnostics raw={llmResponse} />
              </div>
            </section>
          </div>
        </div>

        <div className="shrink-0 border-t border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900/50 sm:px-8">
          <p className="text-center text-xs font-medium leading-relaxed text-neutral-500 dark:text-neutral-400">
            Estimates are model-generated from your image and may vary with portion size
            and lighting.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
