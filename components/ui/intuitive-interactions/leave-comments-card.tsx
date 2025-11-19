"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function LeaveCommentsCard() {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [showResponse, setShowResponse] = useState(false);

  // Animation sequence
  // 0: Wait
  // 1: AI asks question (already there)
  // 2: User starts typing
  // 3: User sends
  // 4: AI 'thinking' bubble
  // 5: AI responds
  // 6: Reset

  const fullText = "Hit a new PR on bench press!";

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const typeChar = (index: number) => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        timeout = setTimeout(
          () => typeChar(index + 1),
          30 + Math.random() * 40 // Faster typing
        );
      } else {
        // Finished typing
        setIsTyping(false);
        timeout = setTimeout(() => setStep(2), 1000); // Wait before sending
      }
    };

    if (step === 0) {
      // Initial pause
      timeout = setTimeout(() => {
        setStep(1);
      }, 1000);
    } else if (step === 1) {
      // Start Typing
      setIsTyping(true);
      typeChar(0);
    } else if (step === 2) {
      // Send Message (clear input, show user message? No, let's just show interaction)
      // For this card, we just want to show the INPUT interaction mostly.
      // Let's make it: Type -> Send Animation -> Show "Logged!" toast/bubble -> Reset

      // Simulate Send
      setText("");
      setShowResponse(true);
      timeout = setTimeout(() => {
        setShowResponse(false);
        setStep(0); // Loop back
      }, 3000);
    }

    return () => clearTimeout(timeout);
  }, [step]);

  return (
    <div className="flex flex-col h-full p-6 bg-white dark:bg-black rounded-3xl shadow-sm border border-neutral-100 dark:border-neutral-800 transition-colors duration-300 relative overflow-hidden">
      <div className="mb-6 relative z-10">
        <h3 className="text-lg font-semibold mb-1 text-black dark:text-white">
          AI Journal
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Tell AEVIO what you did. It logs the structured data for you.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-end space-y-4 relative z-10">
        {/* AI Question Bubble */}
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-1 max-w-[85%]">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                AEVIO
              </span>
              <span className="text-xs text-neutral-400">Just now</span>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 p-3 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl text-sm text-neutral-600 dark:text-neutral-300 shadow-sm">
              Good evening! How was your training session today?
            </div>
          </div>
        </div>

        {/* Success Toast / Response */}
        <AnimatePresence>
          {showResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              className="self-end bg-indigo-600 text-white px-4 py-2 rounded-2xl rounded-tr-sm text-sm font-medium shadow-lg shadow-indigo-500/30 flex items-center gap-2"
            >
              <span>{fullText}</span>
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Processing Indicator */}
        <AnimatePresence>
          {showResponse && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 text-xs text-neutral-400 ml-11"
            >
              <Bot className="w-3 h-3" />
              <span>Processing workout data...</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Input Simulation */}
        <div className="relative mt-2">
          <motion.div
            animate={{
              borderColor: isTyping
                ? "var(--border-active)"
                : "var(--border-inactive)",
              boxShadow: isTyping ? "0 0 0 2px var(--ring-active)" : "none",
            }}
            style={
              {
                "--border-active": "#000", // dark mode override handled in className
                "--border-inactive": "#e5e5e5",
                "--ring-active": "rgba(0,0,0,0.05)",
              } as any
            }
            className={cn(
              "w-full h-12 px-4 py-2 rounded-full border transition-all duration-200 flex items-center justify-between bg-white dark:bg-neutral-900",
              "dark:border-neutral-800 dark:data-[typing=true]:border-white dark:data-[typing=true]:ring-white/10" // Dark mode overrides
            )}
            data-typing={isTyping}
          >
            <div className="flex-1 relative overflow-hidden h-full flex items-center">
              {/* Placeholder */}
              {text === "" && !isTyping && (
                <span className="text-neutral-400 absolute pointer-events-none">
                  Log your activity...
                </span>
              )}

              {/* Text Content */}
              <span className="text-neutral-900 dark:text-white whitespace-pre">
                {text}
                {/* Cursor */}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-[2px] h-4 bg-black dark:bg-white align-middle ml-0.5"
                  />
                )}
              </span>
            </div>
            <motion.div
              animate={{
                backgroundColor:
                  text.length > 0 ? "rgb(79, 70, 229)" : "rgb(229, 229, 229)", // Indigo-600 vs Neutral-200
                scale: text.length > 0 ? 1 : 0.9,
              }}
              className="p-1.5 rounded-full text-white flex items-center justify-center"
            >
              <Send className="w-3 h-3" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none z-0" />
    </div>
  );
}
