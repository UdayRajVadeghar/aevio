"use client";

import { motion } from "framer-motion";
import {
  Book,
  Calendar,
  ChevronRight,
  Edit3,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Tag,
} from "lucide-react";
import { useState } from "react";

const journalEntries = [
  {
    id: 1,
    title: "Deep Work Session Reflection",
    preview:
      "Today I managed to get 4 hours of deep work done. The focus was intense, and I felt a flow state for the majority of the time...",
    date: "Today, 10:23 AM",
    tags: ["Productivity", "Work"],
    mood: "High",
  },
  {
    id: 2,
    title: "Morning Routine Adjustments",
    preview:
      "Thinking about shifting my wake-up time to 5:30 AM to squeeze in some meditation before the day starts. The current routine feels rushed...",
    date: "Yesterday, 8:45 AM",
    tags: ["Habits", "Health"],
    mood: "Neutral",
  },
  {
    id: 3,
    title: "Weekly Review: October Week 3",
    preview:
      "A mixed week. High output on the coding front, but neglected physical exercise. Need to balance the two better next week...",
    date: "Oct 20, 2024",
    tags: ["Review", "Planning"],
    mood: "Mixed",
  },
  {
    id: 4,
    title: "Idea for new feature",
    preview:
      "What if we added a biometric feedback loop to the planner? It could suggest rest days based on HRV data...",
    date: "Oct 18, 2024",
    tags: ["Ideas", "Dev"],
    mood: "Excited",
  },
];

export default function JournalPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <main className="relative min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-hidden font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-black dark:to-neutral-900" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02] dark:opacity-[0.05]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            {/* Header Content */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-6">
              <Book size={14} />
              <span>Cognitive Log</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black tracking-tighter font-sans">
              YOUR <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-900 via-neutral-500 to-neutral-900 dark:from-white dark:via-neutral-500 dark:to-white animate-text-shimmer bg-[length:200%_auto]">
                CHRONICLE
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors text-sm font-medium">
              <Filter size={16} />
              <span>Filter</span>
            </button>
            <button className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity text-sm font-medium">
              <Plus size={16} className="transition-transform group-hover:rotate-90" />
              <span>New Entry</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar / Stats */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold">Streak</h3>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-bold">12</span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                  days
                </span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[40%]" />
              </div>
              <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                You're on a roll. Consistency is the key to clarity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 rounded-3xl bg-white dark:bg-black border border-neutral-200 dark:border-neutral-800"
            >
              <div className="flex items-center gap-2 mb-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                <Search size={16} />
                <span>Search entries...</span>
              </div>
              <div className="space-y-2">
                {["All Entries", "Favorites", "Ideas", "Reflections"].map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-colors ${
                        activeTab === tab.toLowerCase() ||
                        (activeTab === "all" && tab === "All Entries")
                          ? "bg-neutral-100 dark:bg-neutral-900 font-medium"
                          : "text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                      }`}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>
            </motion.div>
          </div>

          {/* Entries List */}
          <div className="lg:col-span-8 space-y-4">
            {journalEntries.map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                className="group relative p-6 rounded-3xl bg-white dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all hover:shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      <Calendar size={12} />
                      <span>{entry.date}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                      <span>{entry.mood}</span>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {entry.title}
                    </h3>
                  </div>
                  <button className="p-2 rounded-full text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 line-clamp-2">
                  {entry.preview}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-900 text-[10px] font-medium text-neutral-600 dark:text-neutral-400"
                      >
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                    Read
                    <ChevronRight size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

