"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Banknote,
  Box,
  Briefcase,
  Cloud,
  CreditCard,
  FileText,
  Github,
  HardDrive,
  LayoutDashboard,
  Slack,
  UserPlus,
  Users,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// Re-implementing AnimatedConnection to control the dot animation via Framer Motion for better synchronization
const Connection = ({
  fromRef,
  toRef,
  containerRef,
  curvature = 0.5,
  isDashed = false,
  isActive = false, // controls if the dot is moving
}: {
  fromRef: React.RefObject<HTMLDivElement | null>;
  toRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  curvature?: number;
  isDashed?: boolean;
  isActive?: boolean;
}) => {
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let rafId: number;
    let isUpdating = false;

    const updatePath = () => {
      if (isUpdating || !containerRef.current || !fromRef.current || !toRef.current) return;
      
      isUpdating = true;
      rafId = requestAnimationFrame(() => {
        if (containerRef.current && fromRef.current && toRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const rectA = fromRef.current.getBoundingClientRect();
          const rectB = toRef.current.getBoundingClientRect();

          const svgWidth = containerRect.width;
          const svgHeight = containerRect.height;
          setSvgDimensions({ width: svgWidth, height: svgHeight });

          const startX = rectA.right - containerRect.left;
          const startY = rectA.top + rectA.height / 2 - containerRect.top;
          const endX = rectB.left - containerRect.left;
          const endY = rectB.top + rectB.height / 2 - containerRect.top;

          // Logic for connecting Right edge of Input to Left edge of Hub
          // OR Right edge of Hub to Left edge of Destinations.
          // The standard logic above handles (Right -> Left) connections if we treat A as left and B as right.

          const controlX1 = startX + (endX - startX) * curvature;
          const controlY1 = startY;
          const controlX2 = endX - (endX - startX) * curvature;
          const controlY2 = endY;

          const d = `M ${startX},${startY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${endX},${endY}`;
          setPathD(d);
        }
        isUpdating = false;
      });
    };

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updatePath, 100);
    };

    // Initial delay to ensure layout calculation
    const timer = setTimeout(updatePath, 100);
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
      clearTimeout(resizeTimeout);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [containerRef, fromRef, toRef, curvature]);

  return (
    <svg
      className="pointer-events-none absolute inset-0 overflow-visible z-0"
      width={svgDimensions.width}
      height={svgDimensions.height}
      style={{ willChange: "auto" }}
    >
      <path
        d={pathD}
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray={isDashed ? "6 6" : "none"}
        className="text-neutral-200 dark:text-neutral-700"
      />

      {/* The moving dot */}
      <AnimatePresence>
        {isActive && pathD && (
          <motion.circle
            initial={{ opacity: 0, "--offset-distance": "0%" } as any}
            animate={{ opacity: 1, "--offset-distance": "100%" } as any}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{
              duration: 2,
              ease: [0.22, 1, 0.36, 1], // Custom sleek easing
            }}
            r="3" // Slightly smaller for sleekness
            fill="#f97316"
            style={{
              offsetPath: `path('${pathD}')`,
              offsetDistance: "var(--offset-distance)",
              willChange: "opacity, offset-distance",
            } as React.CSSProperties}
            className="drop-shadow-[0_0_6px_rgba(249,115,22,0.8)] absolute" // Adjusted shadow
          />
        )}
      </AnimatePresence>
    </svg>
  );
};

export const IntegrationDiagram = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs for elements
  const productRef = useRef<HTMLDivElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);

  // Category refs
  const accountingRef = useRef<HTMLDivElement>(null);
  const atsRef = useRef<HTMLDivElement>(null);
  const crmRef = useRef<HTMLDivElement>(null);
  const hrisRef = useRef<HTMLDivElement>(null);
  const fileStorageRef = useRef<HTMLDivElement>(null);
  const ticketingRef = useRef<HTMLDivElement>(null);

  // State to manage animation phases
  // Phase 1: Input -> Hub
  // Phase 2: Hub -> Destinations
  const [phase, setPhase] = useState<1 | 2>(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase((prev) => (prev === 1 ? 2 : 1));
    }, 2200); // Slightly longer than animation duration (2s) to allow for pause/reset
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto h-[600px] flex items-center justify-between p-8 bg-transparent rounded-xl overflow-hidden"
    >
      {/* SVG Layer for Connections */}
      {/* Phase 1 Connections: Inputs -> Hub */}
      <Connection
        containerRef={containerRef}
        fromRef={productRef}
        toRef={hubRef}
        isActive={phase === 1}
        curvature={0.4}
      />
      <Connection
        containerRef={containerRef}
        fromRef={agentRef}
        toRef={hubRef}
        isActive={phase === 1}
        curvature={0.4}
      />

      {/* Phase 2 Connections: Hub -> Destinations */}
      <Connection
        containerRef={containerRef}
        fromRef={hubRef}
        toRef={accountingRef}
        isDashed
        isActive={phase === 2}
        curvature={0.4}
      />
      <Connection
        containerRef={containerRef}
        fromRef={hubRef}
        toRef={atsRef}
        isDashed
        isActive={phase === 2}
        curvature={0.4}
      />
      <Connection
        containerRef={containerRef}
        fromRef={hubRef}
        toRef={crmRef}
        isDashed
        isActive={phase === 2}
        curvature={0.4}
      />
      <Connection
        containerRef={containerRef}
        fromRef={hubRef}
        toRef={hrisRef}
        isDashed
        isActive={phase === 2}
        curvature={0.4}
      />
      <Connection
        containerRef={containerRef}
        fromRef={hubRef}
        toRef={fileStorageRef}
        isDashed
        isActive={phase === 2}
        curvature={0.4}
      />
      <Connection
        containerRef={containerRef}
        fromRef={hubRef}
        toRef={ticketingRef}
        isDashed
        isActive={phase === 2}
        curvature={0.4}
      />

      {/* Left Column: Inputs */}
      <div className="flex flex-col justify-center gap-20 z-10 w-64">
        {/* Your Product */}
        <div
          ref={productRef}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 shadow-sm flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded flex items-center justify-center text-neutral-500">
            <LayoutDashboard size={20} />
          </div>
          <span className="font-medium text-sm text-neutral-700 dark:text-neutral-200">
            Your Product
          </span>
        </div>

        {/* Your Agent */}
        <div
          ref={agentRef}
          className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 shadow-sm flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded flex items-center justify-center text-neutral-500">
            <Box size={20} />
          </div>
          <span className="font-medium text-sm text-neutral-700 dark:text-neutral-200">
            Your Agent
          </span>
        </div>
      </div>

      {/* Center Column: The Hub */}
      <div className="relative z-10 flex items-center justify-center">
        <div
          ref={hubRef}
          className="w-24 h-24 bg-white dark:bg-neutral-900 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-xl flex items-center justify-center relative z-20"
        >
          {/* Logo Icon (Y shape) */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-neutral-800 dark:text-white"
          >
            <path
              d="M12 2v20M12 12l-6-6M12 12l6-6"
              transform="rotate(180 12 12)"
            />
          </svg>
        </div>
        {/* Pulse effect */}
        <div className="absolute w-32 h-32 bg-neutral-100 dark:bg-neutral-800 rounded-full -z-10 animate-pulse opacity-50" />
      </div>

      {/* Right Column: Destinations */}
      <div className="flex flex-col justify-center gap-4 z-10 w-64">
        {/* Integration Categories */}
        {[
          {
            ref: accountingRef,
            label: "Accounting",
            icons: [
              <Banknote size={14} key="1" />,
              <CreditCard size={14} key="2" />,
            ],
          },
          {
            ref: atsRef,
            label: "ATS",
            icons: [
              <Users size={14} key="3" />,
              <UserPlus size={14} key="4" />,
            ],
          },
          {
            ref: crmRef,
            label: "CRM",
            icons: [
              <Users size={14} key="5" />,
              <Briefcase size={14} key="6" />,
            ],
          },
          {
            ref: fileStorageRef,
            label: "File Storage",
            icons: [
              <HardDrive size={14} key="7" />,
              <Cloud size={14} key="8" />,
            ],
          },
          {
            ref: hrisRef,
            label: "HRIS",
            icons: [
              <FileText size={14} key="9" />,
              <Briefcase size={14} key="10" />,
            ],
          },
          {
            ref: ticketingRef,
            label: "Ticketing",
            icons: [
              <Github size={14} key="11" />,
              <Slack size={14} key="12" />,
            ],
          },
        ].map((category, index) => (
          <div
            key={index}
            ref={category.ref}
            className="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 rounded-lg transition-colors"
          >
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              {category.label}
            </span>
            <div className="flex -space-x-2">
              {category.icons.map((icon, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-white dark:border-neutral-900 flex items-center justify-center text-neutral-500"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
