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
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-neutral-50 dark:bg-black p-6">
      {/* Lively Background */}
      <AuthBackground />

      {/* Navigation - Back to Home */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-sm text-neutral-500 hover:text-black dark:hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </Link>

      {/* Main Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-2xl p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-4 h-4 bg-white dark:bg-black rounded-sm" />
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-2">
              {title}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {subtitle}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-6">{children}</div>
        </div>

        {/* Decorative bottom glow */}
        <div className="absolute -inset-[1px] -z-10 rounded-2xl bg-gradient-to-b from-transparent to-neutral-200/50 dark:to-neutral-800/50 opacity-50 blur-sm" />
      </motion.div>
    </div>
  );
}
