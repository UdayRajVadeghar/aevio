"use client";

import { BentoCard, BentoGrid } from "@/components/ui/hero-section/bento-grid";
import { Dither } from "@/components/ui/hero-section/dither";
import { HeroVisual } from "@/components/ui/hero-section/hero-visual";
import { ThemeToggle } from "@/components/ui/hero-section/theme-toggle";
import { LightRays } from "@/components/ui/magic-ui/light-rays";
import { GymNeonShowcase } from "@/components/ui/showcase/gym-neon-showcase";
import { ArrowRight, BarChart3, Brain, Lock, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-x-hidden font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Light Mode "Vapor" Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none dark:hidden overflow-hidden"
        aria-hidden="true"
      >
        <LightRays
          color="rgba(0, 0, 0, 0.05)"
          blendMode="multiply"
          count={20}
          speed={8}
        />
      </div>

      <Dither />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <div className="w-4 h-4 bg-black dark:bg-white" />
            aevio
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6 text-sm font-medium">
              <a
                href="#"
                className="hover:underline underline-offset-4 decoration-dotted"
              >
                Product
              </a>
              <a
                href="#"
                className="hover:underline underline-offset-4 decoration-dotted"
              >
                Manifesto
              </a>
              <a
                href="#"
                className="hover:underline underline-offset-4 decoration-dotted"
              >
                Pricing
              </a>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 border-b border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block border border-black dark:border-white px-3 py-1 text-xs font-mono uppercase tracking-widest">
              v1.0.0 Public Beta
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
              METRICS <br />
              FOR THE <br />
              <span className="text-neutral-400 dark:text-neutral-600">
                UNBOUND
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed">
              The minimal AI journal for high-performance individuals. Track
              sleep, fitness, and cognitive load without the noise.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/authentication?view=signup"
                className="group relative px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all"
              >
                <span className="flex items-center gap-2">
                  Start Tracking{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <button className="px-6 py-3 border border-black dark:border-white text-black dark:text-white font-medium text-sm hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all">
                Read Manifesto
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-neutral-200 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 blur-lg opacity-50" />
            <HeroVisual className="shadow-2xl" />
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-black dark:bg-white z-0 opacity-10 pattern-dots" />
          </div>
        </div>
      </section>

      {/* Features / Bento Grid */}
      <section className="py-24 px-6 bg-neutral-50 dark:bg-black">
        <div className="max-w-7xl mx-auto mb-16">
          <h2 className="text-4xl font-bold tracking-tighter mb-6">
            SYSTEM ARCHITECTURE
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
            Our neural engine processes your biological data points to
            reconstruct your daily performance capacity.
          </p>
        </div>

        <BentoGrid>
          <BentoCard
            title="Neural Analysis"
            description="Advanced pattern recognition for your health metrics."
            header={
              <div className="h-full min-h-[6rem] w-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                <Brain className="w-12 h-12 opacity-20" />
              </div>
            }
            className="md:col-span-2"
            icon={<Brain className="w-4 h-4" />}
          />
          <BentoCard
            title="Real-time Sync"
            description="Zero-latency synchronization across all devices."
            header={
              <div className="h-full min-h-[6rem] w-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                <Zap className="w-12 h-12 opacity-20" />
              </div>
            }
            className="md:col-span-1"
            icon={<Zap className="w-4 h-4" />}
          />
          <BentoCard
            title="Encrypted Core"
            description="Your biological data is encrypted at rest."
            header={
              <div className="h-full min-h-[6rem] w-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                <Lock className="w-12 h-12 opacity-20" />
              </div>
            }
            className="md:col-span-1"
            icon={<Lock className="w-4 h-4" />}
          />
          <BentoCard
            title="Predictive Analytics"
            description="Forecast your energy levels based on sleep debt."
            header={
              <div className="h-full min-h-[6rem] w-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
                <BarChart3 className="w-12 h-12 opacity-20" />
              </div>
            }
            className="md:col-span-2"
            icon={<BarChart3 className="w-4 h-4" />}
          />
        </BentoGrid>
      </section>
      {/* Showcase Section */}
      <section className="py-24 px-6 border-b border-black/10 dark:border-white/10">
        <GymNeonShowcase />
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 dark:border-white/10 py-12 px-6 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold">
            <div className="w-3 h-3 bg-black dark:bg-white" />
            AEVIO INC.
          </div>
          <div className="text-xs text-neutral-500 font-mono">
            © 2024 AEVIO SYSTEM. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>
    </main>
  );
}
