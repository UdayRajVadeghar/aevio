import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoCard = ({
  className,
  children,
  title,
  description,
  icon,
  header,
}: {
  className?: string;
  children?: ReactNode;
  title?: string;
  description?: string;
  icon?: ReactNode;
  header?: ReactNode;
}) => {
  return (
    <div
      className={cn(
        "row-span-1 group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 justify-between flex flex-col space-y-4 overflow-hidden relative",
        // Sharp edges as requested
        "rounded-none",
        className
      )}
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%221%22/%3E%3C/svg%3E')] opacity-10 pointer-events-none mix-blend-multiply dark:mix-blend-overlay"></div>
      <div className="relative z-10">{header}</div>
      <div className="group-hover/bento:translate-x-2 transition duration-200 relative z-10">
        {icon}
        <div className="font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
          {title}
        </div>
        <div className="font-normal text-neutral-600 text-xs dark:text-neutral-300">
          {description}
        </div>
        {children}
      </div>
    </div>
  );
};
