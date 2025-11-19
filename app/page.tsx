"use client";

import { BentoCard, BentoGrid } from "@/components/ui/hero-section/bento-grid";
import { Dither } from "@/components/ui/hero-section/dither";
import { ThemeToggle } from "@/components/ui/hero-section/theme-toggle";
import { IntegrationDiagram } from "@/components/ui/integration-diagram";
import { IntuitiveInteractions } from "@/components/ui/intuitive-interactions/intuitive-interactions";
import { FeaturesOrbit } from "@/components/ui/landing/features-orbit";
import { LightRays } from "@/components/ui/magic-ui/light-rays";
import { GymNeonShowcase } from "@/components/ui/showcase/gym-neon-showcase";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  Brain,
  Cpu,
  Lock,
  Network,
  ShieldCheck,
  Zap,
} from "lucide-react";
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
            <FeaturesOrbit />
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-black dark:bg-white z-0 opacity-10 pattern-dots" />
          </div>
        </div>
      </section>

      {/* Features / Bento Grid */}
      <section className="py-24 px-6 bg-neutral-50 dark:bg-black">
        <div className="max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold tracking-tighter mb-6">
              THE AEVIO ENGINE
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
              The neural architecture powering your biological optimization. We
              don't just track data; we interpret the signal in the noise.
            </p>
          </motion.div>
        </div>

        <BentoGrid>
          <BentoCard
            title="Neural Synapse"
            description="Proprietary AI that decodes your biological signals into actionable insights."
            header={
              <div className="h-full min-h-[6rem] w-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center overflow-hidden">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Brain className="w-12 h-12 text-neutral-800 dark:text-neutral-200 opacity-80" />
                </motion.div>
              </div>
            }
            className="md:col-span-2"
            icon={<Cpu className="w-4 h-4" />}
          />
          <BentoCard
            title="Quantum Link"
            description="State synchronization across your digital ecosystem with zero latency."
            header={
              <div className="h-full min-h-[6rem] w-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center overflow-hidden">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Network className="w-12 h-12 text-neutral-800 dark:text-neutral-200 opacity-80" />
                </motion.div>
              </div>
            }
            className="md:col-span-1"
            icon={<Zap className="w-4 h-4" />}
          />
          <BentoCard
            title="Vault Zero"
            description="Military-grade AES-256 encryption. Your data remains yours, always."
            header={
              <div className="h-full min-h-[6rem] w-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <ShieldCheck className="w-12 h-12 text-neutral-800 dark:text-neutral-200 opacity-80" />
                </motion.div>
              </div>
            }
            className="md:col-span-1"
            icon={<Lock className="w-4 h-4" />}
          />
          <BentoCard
            title="Predictive State"
            description="Forecast your cognitive and physical capacity 24 hours in advance."
            header={
              <div className="h-full min-h-[6rem] w-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center overflow-hidden gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 bg-neutral-400 dark:bg-neutral-600 rounded-full"
                    animate={{
                      height: [20, 40, 20],
                      backgroundColor: ["#a3a3a3", "#525252", "#a3a3a3"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            }
            className="md:col-span-2"
            icon={<Activity className="w-4 h-4" />}
          />
        </BentoGrid>
      </section>

      {/* Intuitive Interactions Section */}
      <IntuitiveInteractions />

      <IntegrationDiagram />

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
