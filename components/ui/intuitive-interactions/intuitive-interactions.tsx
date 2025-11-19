"use client";

import { CopyCard } from "./copy-card";
import { LeaveCommentsCard } from "./leave-comments-card";
import { SaveCollectionsCard } from "./save-collections-card";

export function IntuitiveInteractions() {
  return (
    <section className="py-24 px-6 bg-neutral-50 dark:bg-black border-b border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl font-bold tracking-tighter mb-6">
            What you can do with AEVIO
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
            AEVIO is more than just a journal. It's a tool that helps you track
            your health and fitness.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="h-[400px]">
            <CopyCard />
          </div>
          <div className="h-[400px]">
            <SaveCollectionsCard />
          </div>
          <div className="h-[400px]">
            <LeaveCommentsCard />
          </div>
        </div>
      </div>
    </section>
  );
}
