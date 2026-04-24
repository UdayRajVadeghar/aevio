"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AuthBackground } from "./auth-background";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showSocialAuth?: boolean;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full flex items-start sm:items-center justify-center overflow-y-auto bg-neutral-50 dark:bg-black px-4 pt-20 pb-12 sm:p-6">
      {/* Lively Background */}
      <AuthBackground />

      {/* Navigation - Back to Home */}
      <Link
        href="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-2 text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </Link>

      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-auto mt-8 sm:mt-0"
      >
        <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/[0.15] bg-white/80 dark:bg-neutral-900/60 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8 text-center">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="w-8 h-8 bg-black dark:bg-white shadow-lg" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
              {title}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 px-2 sm:px-0">
              {subtitle}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-5 sm:space-y-6">{children}</div>
        </div>

        {/* Decorative bottom glow */}
        <div className="absolute -inset-[1px] -z-10 rounded-2xl bg-gradient-to-b from-transparent to-neutral-200/50 dark:to-neutral-800/50 opacity-50 blur-sm" />
      </motion.div>
    </div>
  );
}
