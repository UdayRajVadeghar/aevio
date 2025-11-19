"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const codeSnippets = [
  "import { Neural } from '@aevio/core';",
  "const user = await Neural.analyze({",
  "  heartRate: 72,",
  "  sleepScore: 85,",
  "  mood: 'focused'",
  "});",
  "",
  "// Generating daily plan...",
  "const plan = user.optimize({",
  "  goal: 'hypertrophy',",
  "  time: '45m'",
  "});",
  "",
  "console.log('System ready.');",
];

export const RetroCode = ({ className }: { className?: string }) => {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    let timeout: NodeJS.Timeout;

    const type = () => {
      if (currentLine >= codeSnippets.length) {
        // Reset after delay
        timeout = setTimeout(() => {
          setLines([]);
          currentLine = 0;
          currentChar = 0;
          type();
        }, 3000);
        return;
      }

      const lineText = codeSnippets[currentLine];

      if (currentChar < lineText.length) {
        setLines((prev) => {
          const newLines = [...prev];
          if (newLines[currentLine] === undefined) newLines[currentLine] = "";
          newLines[currentLine] = lineText.substring(0, currentChar + 1);
          return newLines;
        });
        currentChar++;
        timeout = setTimeout(type, Math.random() * 30 + 20);
      } else {
        currentLine++;
        currentChar = 0;
        timeout = setTimeout(type, 100);
      }
    };

    type();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={cn(
        "font-mono text-xs leading-tight p-4 bg-neutral-100 dark:bg-neutral-900 border border-black dark:border-white min-h-[300px] w-full overflow-hidden relative",
        className
      )}
    >
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />

      <div className="relative z-20">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-neutral-800 dark:text-neutral-300 whitespace-pre-wrap break-all"
          >
            {line}
          </motion.div>
        ))}
        <motion.span
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-2 h-4 bg-black dark:bg-white ml-1 align-middle"
        />
      </div>
    </div>
  );
};
