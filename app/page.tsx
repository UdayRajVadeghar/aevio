"use client";

import { BentoCard, BentoGrid } from "@/components/ui/hero-section/bento-grid";
import { FeaturesOrbit } from "@/components/ui/landing/features-orbit";
import { PreFooterCTA } from "@/components/ui/pre-footer-cta";
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
    <main
      className="relative min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-x-hidden font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black"
      style={{ willChange: "auto" }}
    >
      {/* Light Mode "Vapor" Background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none dark:hidden overflow-hidden"
        aria-hidden="true"
      ></div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 border-b border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block border border-black dark:border-white px-3 py-1 text-xs font-mono uppercase tracking-widest">
              Built for everyday consistency
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9]">
              TRACK WHAT <br />
              MATTERS <br />
              <span className="text-neutral-400 dark:text-neutral-600">
                FEEL BETTER DAILY
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed">
              Aevio helps you log sleep, workouts, and focus in minutes, then
              shows what is actually improving your energy and performance.
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
            <div className="" />
            <FeaturesOrbit />
            {/* Decorative elements */}
          </div>
        </div>
      </section>

      {/* Features / Bento Grid */}
      <section className="relative py-24 px-6 bg-neutral-50 dark:bg-black overflow-hidden">
        {/* Ambient Background for Glassmorphism */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
          <div className="hidden md:block absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-neutral-200/50 dark:bg-neutral-800/20 rounded-full blur-[120px] transform-gpu" />
          <div className="hidden md:block absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-neutral-200/50 dark:bg-neutral-800/20 rounded-full blur-[100px] transform-gpu" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3, margin: "0px 0px -100px 0px" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <h2 className="text-4xl font-bold tracking-tighter mb-6">
              BUILT FOR REAL DAILY PROGRESS
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Aevio helps you connect sleep, training, and mental energy so you
              can make better decisions each day, not just collect more numbers.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10">
          <BentoGrid>
            <BentoCard
              title="Smarter Daily Insights"
              description="Turn your logs into clear takeaways so you know what helped, what hurt, and what to adjust next."
              header={
                <div className="h-full min-h-[6rem] w-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                  <div>
                    <Brain className="w-12 h-12 text-neutral-800 dark:text-neutral-200 opacity-80" />
                  </div>
                </div>
              }
              className="md:col-span-2"
              icon={<Cpu className="w-4 h-4" />}
            />
            <BentoCard
              title="All Your Metrics Together"
              description="See sleep, workouts, and focus in one place so your day makes sense at a glance."
              header={
                <div className="h-full min-h-[6rem] w-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                  <div>
                    <Network className="w-12 h-12 text-neutral-800 dark:text-neutral-200 opacity-80" />
                  </div>
                </div>
              }
              className="md:col-span-1"
              icon={<Zap className="w-4 h-4" />}
            />
            <BentoCard
              title="Private by Default"
              description="Your health and performance data stays protected, and you stay in control of what you share."
              header={
                <div className="h-full min-h-[6rem] w-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center overflow-hidden">
                  <div>
                    <ShieldCheck className="w-12 h-12 text-neutral-800 dark:text-neutral-200 opacity-80" />
                  </div>
                </div>
              }
              className="md:col-span-1"
              icon={<Lock className="w-4 h-4" />}
            />
            <BentoCard
              title="Plan Better Days"
              description="Spot patterns early and prepare for low-energy days before they throw off your routine."
              header={
                <div className="h-full min-h-[6rem] w-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center overflow-hidden gap-2">
                  {[20, 28, 36, 30, 24].map((height, i) => (
                    <div
                      key={i}
                      className="w-2 bg-neutral-400 dark:bg-neutral-600 rounded-full"
                      style={{ height }}
                    />
                  ))}
                </div>
              }
              className="md:col-span-2"
              icon={<Activity className="w-4 h-4" />}
            />
          </BentoGrid>
        </div>
      </section>

      {/* Showcase Section */}

      {/* <GymNeonShowcase /> */}

      <PreFooterCTA />

    </main>
  );
}
