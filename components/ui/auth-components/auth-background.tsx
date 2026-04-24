"use client";

import { motion, useReducedMotion } from "framer-motion";
import { memo, useEffect, useMemo, useState } from "react";

type StreamConfig = {
  duration: number;
  delay: number;
};

type NodeConfig = {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
};

export const AuthBackground = memo(function AuthBackground() {
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const streamConfigs = useMemo<StreamConfig[]>(
    () =>
      Array.from({ length: 5 }, () => ({
        duration: 3 + Math.random() * 2,
        delay: Math.random() * 2,
      })),
    [],
  );

  const nodeConfigs = useMemo<NodeConfig[]>(
    () =>
      Array.from({ length: 8 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 4 + Math.random() * 4,
        duration: 4 + Math.random() * 4,
        delay: Math.random() * 2,
      })),
    [],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-white dark:bg-neutral-950 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#e5e5e5,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#262626,transparent)] opacity-40" />
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
        {streamConfigs.map((stream, i) => (
          <motion.div
            key={i}
            className="w-[1px] h-full bg-gradient-to-b from-transparent via-black dark:via-white to-transparent"
            initial={{ y: "-100%" }}
            animate={shouldReduceMotion ? { y: 0 } : { y: "100%" }}
            transition={{
              duration: stream.duration,
              repeat: shouldReduceMotion ? 0 : Infinity,
              ease: "linear",
              delay: stream.delay,
            }}
          />
        ))}
      </div>

      {/* Floating Nodes */}
      <div className="absolute inset-0">
        {nodeConfigs.map((node, i) => (
          <FloatingNode
            key={i}
            config={node}
            shouldReduceMotion={Boolean(shouldReduceMotion)}
          />
        ))}
      </div>

      {/* Radial Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-black dark:via-transparent dark:to-transparent opacity-80" />
    </div>
  );
});

function FloatingNode({
  config,
  shouldReduceMotion,
}: {
  config: NodeConfig;
  shouldReduceMotion: boolean;
}) {
  const { x, y, size, duration, delay } = config;

  return (
    <motion.div
      className="absolute rounded-full bg-black dark:bg-white opacity-10 dark:opacity-20"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
      }}
      animate={
        shouldReduceMotion
          ? { y: 0, opacity: 0.12, scale: 1 }
          : {
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }
      }
      transition={{
        duration,
        repeat: shouldReduceMotion ? 0 : Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}
