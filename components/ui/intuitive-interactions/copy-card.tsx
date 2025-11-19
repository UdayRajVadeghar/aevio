"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Copy } from "lucide-react";
import { useEffect, useState } from "react";

export function CopyCard() {
  const [status, setStatus] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    if (status === "copied") {
      const timer = setTimeout(() => {
        setStatus("idle");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 bg-white rounded-3xl shadow-sm border border-neutral-100">
      <div className="mb-8 text-center">
        <h3 className="text-lg font-semibold mb-1">Copy to Figma</h3>
        <p className="text-sm text-neutral-500 max-w-[200px]">
          Download designs you like or copy it straight into Figma.
        </p>
      </div>

      <div className="h-12 w-full max-w-[240px] relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          {status === "idle" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="flex w-full h-full rounded-full bg-neutral-100 p-1 overflow-hidden"
            >
              <button
                onClick={() => setStatus("copied")}
                className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-neutral-700 hover:bg-white hover:shadow-sm rounded-full transition-all duration-200"
              >
                <Copy className="w-4 h-4" />
                <span>Create Plan</span>
              </button>
              <div className="w-px h-4 bg-neutral-300 my-auto mx-1" />
              <button className="flex-1 flex items-center justify-center text-sm font-medium text-neutral-700 hover:bg-white hover:shadow-sm rounded-full transition-all duration-200">
                Save
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="copied"
              layoutId="copy-button"
              initial={{ opacity: 0, scale: 0.9, width: "100%" }}
              animate={{ opacity: 1, scale: 1, width: "100%" }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute inset-0 flex items-center justify-center gap-2 bg-black text-white rounded-full text-sm font-medium"
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Copied to Figma
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
