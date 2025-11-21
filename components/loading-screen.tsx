import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({
  message = "Loading...",
  fullScreen = true,
}: LoadingScreenProps) {
  return (
    <div
      className={`
        flex items-center justify-center w-full
        ${fullScreen ? "fixed inset-0 z-50" : "min-h-screen"}
        bg-white dark:bg-gray-950
        transition-colors duration-200
      `}
    >
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-gray-900 dark:text-white" />
          <div className="absolute inset-0 h-12 w-12 animate-ping opacity-20">
            <Loader2 className="h-12 w-12 text-gray-900 dark:text-white" />
          </div>
        </div>
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {message}
        </p>
      </div>
    </div>
  );
}
