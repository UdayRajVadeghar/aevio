"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, PlusCircle, Moon, Smartphone, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListItemProps {
  icon: React.ReactNode;
  label: string;
  hasBookmark?: boolean;
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
}

function ListItem({ icon, label, hasBookmark, isBookmarked, onBookmarkToggle }: ListItemProps) {
  return (
    <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="text-neutral-500">{icon}</div>
        <span className="text-sm font-medium text-neutral-700">{label}</span>
      </div>
      {hasBookmark && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmarkToggle?.();
          }}
          className="relative p-1 rounded-full hover:bg-neutral-200/50 transition-colors"
        >
          <motion.div
            whileTap={{ scale: 0.8 }}
            animate={{ scale: isBookmarked ? 1.1 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Bookmark
              className={cn(
                "w-5 h-5 transition-colors duration-300",
                isBookmarked ? "fill-black text-black" : "text-neutral-400"
              )}
            />
          </motion.div>
        </button>
      )}
       {!hasBookmark && (
         <div className="w-5 h-5 rounded-full border border-neutral-200 group-hover:border-neutral-300" />
       )}
    </div>
  );
}

export function SaveCollectionsCard() {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div className="flex flex-col h-full p-6 bg-white rounded-3xl shadow-sm border border-neutral-100">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-1">Save to collections</h3>
        <p className="text-sm text-neutral-500">
          Collect your favorite designs and upload your own screenshots.
        </p>
      </div>

      <div className="w-full bg-white rounded-2xl border border-neutral-100 p-2 shadow-sm">
         <div className="px-3 py-2 text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Quick save
         </div>
        <ListItem
          icon={<LayoutGrid className="w-5 h-5" />}
          label="Library"
          hasBookmark
          isBookmarked={isBookmarked}
          onBookmarkToggle={() => setIsBookmarked(!isBookmarked)}
        />
        <ListItem
          icon={<PlusCircle className="w-5 h-5" />}
          label="Create collection"
        />
        <ListItem
          icon={<Moon className="w-5 h-5" />}
          label="Dark Mode"
        />
        <ListItem
          icon={<Smartphone className="w-5 h-5" />}
          label="Launch Screens"
        />
      </div>
    </div>
  );
}

