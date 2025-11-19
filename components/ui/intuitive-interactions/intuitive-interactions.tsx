"use client";

import { CopyCard } from "./copy-card";
import { SaveCollectionsCard } from "./save-collections-card";
import { LeaveCommentsCard } from "./leave-comments-card";

export function IntuitiveInteractions() {
  return (
    <section className="py-24 px-6 bg-neutral-50 dark:bg-black border-b border-black/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl font-bold tracking-tighter mb-6">
            INTUITIVE INTERACTIONS
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
             Micro-interactions that feel natural and responsive.
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

