"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Copy, 
  Save, 
  Check, 
  Bookmark, 
  MoreHorizontal,
  MessageSquare,
  Send
} from "lucide-react";
import { cn } from "@/lib/utils";

// Shared Card Container
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(
    "relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950 h-64 flex flex-col items-center justify-center",
    className
  )}>
    {children}
  </div>
);

// Card 1: Smart Button
const SmartButtonCard = () => {
  const [status, setStatus] = useState<"idle" | "copied">("idle");

  const handleClick = () => {
    if (status === "idle") {
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <Card>
      <div className="w-full max-w-[240px]">
        <AnimatePresence mode="wait">
          {status === "idle" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex gap-2"
            >
              <button
                onClick={handleClick}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900 transition-colors"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
              <button
                className="flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-colors"
              >
                <Save className="h-4 w-4" />
                Save
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="copied"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
            >
              <Check className="h-4 w-4" />
              Copied to Figma
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <p className="absolute bottom-4 text-xs text-neutral-400 font-mono">INTERACTIVE</p>
    </Card>
  );
};

// Card 2: List Toggle
const ListToggleCard = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <Card>
      <div className="w-full max-w-[240px] rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Quick save</span>
          <MoreHorizontal className="h-4 w-4 text-neutral-400" />
        </div>
        <div className="p-2">
          <div className="flex items-center justify-between rounded-lg p-2 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-neutral-100 dark:bg-neutral-800" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Library</span>
                <span className="text-xs text-neutral-500">12 items</span>
              </div>
            </div>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <motion.div
                initial={false}
                animate={{ scale: isBookmarked ? [1, 1.2, 1] : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Bookmark
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isBookmarked 
                      ? "fill-black text-black dark:fill-white dark:text-white" 
                      : "text-neutral-400 group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300"
                  )}
                />
              </motion.div>
            </button>
          </div>
        </div>
      </div>
      <p className="absolute bottom-4 text-xs text-neutral-400 font-mono">MICRO-INTERACTION</p>
    </Card>
  );
};

// Card 3: Typing Simulator
const TypingSimulatorCard = () => {
  const [displayText, setDisplayText] = useState("Saving this for later!");
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let timeout: NodeJS.Timeout;

    const loop = async () => {
      if (!isMounted) return;

      // 1. Start with full text
      setDisplayText("Saving this for later!");
      setIsHighlighting(false);
      await new Promise(r => timeout = setTimeout(r, 2000));
      if (!isMounted) return;

      // 2. Highlight text
      setIsHighlighting(true);
      await new Promise(r => timeout = setTimeout(r, 600));
      if (!isMounted) return;

      // 3. Delete text
      setDisplayText("");
      setIsHighlighting(false);
      await new Promise(r => timeout = setTimeout(r, 400));
      if (!isMounted) return;

      // 4. Type new text
      const targetText = "Sav";
      for (let i = 0; i <= targetText.length; i++) {
        setDisplayText(targetText.slice(0, i));
        await new Promise(r => timeout = setTimeout(r, 150));
        if (!isMounted) return;
      }

      // 5. Wait and restart
      await new Promise(r => timeout = setTimeout(r, 2000));
      if (!isMounted) return;
      loop();
    };

    loop();

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <Card>
      <div className="w-full max-w-[240px] space-y-3">
        {/* Previous comment */}
        <div className="flex gap-3">
          <div className="h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-800 shrink-0" />
          <div className="space-y-1">
            <div className="h-2 w-16 rounded bg-neutral-200 dark:bg-neutral-800" />
            <div className="h-12 w-40 rounded-lg bg-neutral-100 dark:bg-neutral-900 p-2">
              <div className="h-2 w-full rounded bg-neutral-200 dark:bg-neutral-800 mb-2" />
              <div className="h-2 w-2/3 rounded bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </div>
        </div>

        {/* Input field */}
        <div className="relative rounded-lg border border-neutral-200 bg-white px-3 py-2.5 dark:border-neutral-800 dark:bg-neutral-950 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 overflow-hidden">
              <span className={cn(
                "text-sm font-medium text-neutral-900 dark:text-neutral-100 relative z-10",
                isHighlighting && "bg-blue-200 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
              )}>
                {displayText}
              </span>
              {!isHighlighting && showCursor && (
                <span className="inline-block w-[1.5px] h-4 bg-blue-500 align-middle ml-[1px]" />
              )}
            </div>
            <Send className="h-4 w-4 text-neutral-400" />
          </div>
        </div>
      </div>
      <p className="absolute bottom-4 text-xs text-neutral-400 font-mono">SIMULATION</p>
    </Card>
  );
};

export function FeatureShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
      <SmartButtonCard />
      <ListToggleCard />
      <TypingSimulatorCard />
    </div>
  );
}

