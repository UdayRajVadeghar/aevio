"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function LeaveCommentsCard() {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);

  // Animation sequence
  // 0: Initial State (Empty input) -> Wait
  // 1: Start typing "Hit a new PR on bench press!" (char by char)
  // 2: Finished typing -> Wait
  // 3: "Send" (Clear text, show bubble?) -> No, just reset for simplicity or show visual feedback
  // Let's loop the typing.

  const fullText = "Hit a new PR on bench press!";

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const typeChar = (index: number) => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        timeout = setTimeout(
          () => typeChar(index + 1),
          50 + Math.random() * 50
        ); // Random typing speed
      } else {
        // Finished typing
        setIsTyping(false);
        timeout = setTimeout(() => setStep(2), 2000); // Wait before clearing
      }
    };

    if (step === 0) {
      // Wait before starting
      timeout = setTimeout(() => {
        setIsTyping(true);
        typeChar(0);
        setStep(1);
      }, 1000);
    } else if (step === 2) {
      // Reset
      setText("");
      setStep(0);
    }

    return () => clearTimeout(timeout);
  }, [step]);

  return (
    <div className="flex flex-col h-full p-6 bg-white rounded-3xl shadow-sm border border-neutral-100">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">AI Journal</h3>
        <p className="text-sm text-neutral-500">
          Just tell AEVIO what you did. It logs the structured data for you.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-end space-y-4">
        {/* AI Question Bubble */}
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-neutral-900">AEVIO</span>
              <span className="text-xs text-neutral-400">Just now</span>
            </div>
            <div className="bg-neutral-50 border border-neutral-100 p-3 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl text-sm text-neutral-600 shadow-sm">
              Good evening! How was your training session today?
            </div>
          </div>
        </div>

        {/* User Input Simulation */}
        <div className="relative mt-4">
          <div
            className={cn(
              "w-full h-12 px-4 py-2 rounded-full border transition-all duration-200 flex items-center justify-between",
              isTyping
                ? "border-black ring-1 ring-black/5"
                : "border-neutral-200"
            )}
          >
            <div className="flex-1 relative overflow-hidden h-full flex items-center">
              {/* Placeholder */}
              {text === "" && !isTyping && (
                <span className="text-neutral-400 absolute pointer-events-none">
                  Log your activity...
                </span>
              )}

              {/* Text Content */}
              <span className="text-neutral-900 whitespace-pre">
                {text}
                {/* Cursor */}
                {isTyping && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-[2px] h-4 bg-black align-middle ml-0.5"
                  />
                )}
              </span>
            </div>
            <div
              className={cn(
                "p-1.5 rounded-full text-white transition-colors",
                text.length > 0 ? "bg-black" : "bg-neutral-200"
              )}
            >
              <Send className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
