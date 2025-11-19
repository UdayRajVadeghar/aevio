"use client";

import { cn } from "@/lib/utils";
import { Chrome, Github } from "lucide-react";

interface SocialButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: "google" | "github";
  label: string;
}

export function SocialButton({
  icon,
  label,
  className,
  ...props
}: SocialButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "relative flex items-center justify-center gap-2 w-full h-11 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {icon === "github" && <Github className="w-4 h-4" />}
      {icon === "google" && <Chrome className="w-4 h-4" />}{" "}
      {/* Using Chrome as proxy for Google icon for now */}
      {label}
    </button>
  );
}

export function SocialAuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-neutral-200 dark:border-neutral-800" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white/70 dark:bg-neutral-900/70 px-2 text-neutral-500">
          Or continue with
        </span>
      </div>
    </div>
  );
}
