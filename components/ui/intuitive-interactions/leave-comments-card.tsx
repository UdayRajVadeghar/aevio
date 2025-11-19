"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function LeaveCommentsCard() {
  const [text, setText] = useState("Saving this for later!");
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [step, setStep] = useState(0);

  // Animation sequence steps
  // 0: Initial state (full text) - wait
  // 1: Highlight text - wait
  // 2: Delete text (empty) - wait
  // 3: Type 'S'
  // 4: Type 'a'
  // 5: Type 'v'
  // 6: Wait -> Reset to 0

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runAnimation = () => {
      switch (step) {
        case 0: // Initial
          setText("Saving this for later!");
          setIsHighlighted(false);
          timeout = setTimeout(() => setStep(1), 1500);
          break;
        case 1: // Highlight
          setIsHighlighted(true);
          timeout = setTimeout(() => setStep(2), 1000);
          break;
        case 2: // Delete
          setText("");
          setIsHighlighted(false);
          timeout = setTimeout(() => setStep(3), 800);
          break;
        case 3: // Type S
          setText("S");
          timeout = setTimeout(() => setStep(4), 150);
          break;
        case 4: // Type a
          setText("Sa");
          timeout = setTimeout(() => setStep(5), 150);
          break;
        case 5: // Type v
          setText("Sav");
          timeout = setTimeout(() => setStep(6), 1000); // Hold 'Sav' for a bit
          break;
        case 6: // Reset
          setStep(0);
          break;
      }
    };

    runAnimation();

    return () => clearTimeout(timeout);
  }, [step]);

  return (
    <div className="flex flex-col h-full p-6 bg-white rounded-3xl shadow-sm border border-neutral-100">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Leave comments</h3>
        <p className="text-sm text-neutral-500">
          Take notes upon saving so you'll never forget the context.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-end space-y-4">
        {/* Chat Bubble */}
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center flex-shrink-0">
            <img 
                src="https://ui-avatars.com/api/?name=You&background=random" 
                alt="Avatar" 
                className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-neutral-900">You</span>
              <span className="text-xs text-neutral-400">8h ago</span>
            </div>
            <div className="bg-white border border-neutral-100 p-3 rounded-tr-2xl rounded-bl-2xl rounded-br-2xl text-sm text-neutral-600 shadow-sm">
              Love this checkout screen, especially the order summary section.
            </div>
          </div>
        </div>

        {/* Input Field */}
        <div className="relative mt-4">
          <div
            className={cn(
              "w-full h-12 px-4 py-2 rounded-full border transition-all duration-200 flex items-center justify-between",
              "border-blue-500 ring-2 ring-blue-100 bg-white"
            )}
          >
            <div className="flex-1 relative overflow-hidden h-full flex items-center">
               {/* Placeholder */}
               {text === "" && !isHighlighted && (
                   <span className="text-neutral-400 absolute pointer-events-none">Add a comment...</span>
               )}
               
               {/* Text Content */}
              <span className={cn(
                  "text-neutral-900 whitespace-pre",
                  isHighlighted && "bg-blue-100 text-blue-900 selection:bg-blue-200"
              )}>
                {text}
                {/* Cursor */}
                {!isHighlighted && (
                    <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-[2px] h-4 bg-blue-500 align-middle ml-0.5"
                    />
                )}
              </span>
            </div>
            <div className="p-1.5 bg-blue-500 rounded-full text-white">
              <Send className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

