export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10 py-10 px-6 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 font-bold text-black dark:text-white text-sm">
          <div className="w-3 h-3 bg-black dark:bg-white" />
          AEVIO INC.
        </div>
        <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest">
          © 2026 AEVIO SYSTEM. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
