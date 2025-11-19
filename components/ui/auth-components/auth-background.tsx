"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const AuthBackground = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-white dark:bg-black pointer-events-none">
      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
        style={{
          backgroundImage: `linear-gradient(#999 1px, transparent 1px), linear-gradient(90deg, #999 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Animated Data Streams */}
      <div className="absolute inset-0 flex justify-around opacity-20 dark:opacity-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-[1px] h-full bg-gradient-to-b from-transparent via-black dark:via-white to-transparent"
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Floating Nodes */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <FloatingNode key={i} />
        ))}
      </div>

      {/* Radial Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-black dark:via-transparent dark:to-transparent opacity-80" />
    </div>
  );
};

const FloatingNode = () => {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  const size = 4 + Math.random() * 4;

  return (
    <motion.div
      className="absolute rounded-full bg-black dark:bg-white opacity-10 dark:opacity-20"
      style={{
        width: size,
        height: size,
        left: `${randomX}%`,
        top: `${randomY}%`,
      }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.1, 0.3, 0.1],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 4 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 2,
      }}
    />
  );
};
