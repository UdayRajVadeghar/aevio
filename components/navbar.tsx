"use client";

import { ThemeToggle } from "@/components/ui/hero-section/theme-toggle";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  BookOpen,
  Camera,
  ChevronRight,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Analyze", href: "/analyze", icon: Camera },
  { label: "Journal", href: "/journal", icon: BookOpen },
  { label: "My Data", href: "/myData", icon: BarChart3 },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = useSession();

  // Close user menu when clicking outside
  useEffect(() => {
    if (!isUserMenuOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Early return after all hooks have been called
  if (
    pathname?.startsWith("/onboarding") ||
    pathname?.startsWith("/authentication") ||
    pathname?.startsWith("/planner/workout") ||
    pathname?.startsWith("/journal/new")
  ) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <header className="relative w-full border-b border-black/10 dark:border-white/10 bg-white dark:bg-black">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-1 py-1 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          >
            <div className="w-5 h-5 bg-black dark:bg-white" />
            <span className="text-base font-semibold tracking-tight text-black dark:text-white">
              aevio
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-neutral-100 dark:bg-white/10 text-black dark:text-white shadow-sm"
                      : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white",
                  )}
                >
                  <Icon
                    size={16}
                    className={cn(
                      "transition-colors",
                      isActive
                        ? "text-black dark:text-white"
                        : "text-neutral-500 group-hover:text-black dark:group-hover:text-white",
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {session?.user ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex size-9 items-center justify-center rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white transition-colors hover:bg-neutral-100 dark:hover:bg-white/10 cursor-pointer"
                >
                  <User size={18} />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && session?.user && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black shadow-lg"
                    >
                      <div className="border-b border-black/10 dark:border-white/10 px-4 py-3">
                        <p className="text-sm font-medium text-black dark:text-white">
                          {session.user.name || "User"}
                        </p>
                        <p className="mt-1 truncate text-xs text-neutral-500">
                          {session.user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 transition-colors hover:bg-neutral-100 dark:hover:bg-white/10 cursor-pointer"
                      >
                        <LogOut size={16} />
                        Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/authentication"
                className="hidden rounded-md bg-black dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-black transition-colors hover:bg-black/90 dark:hover:bg-white/90 sm:inline-flex"
              >
                Log in
              </Link>
            )}

            <button
              className="rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white cursor-pointer md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[60] flex flex-col bg-white/95 dark:bg-black/95 p-6 backdrop-blur-xl"
          >
            <div className="mb-10 flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-md outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="w-5 h-5 bg-black dark:bg-white" />
                <span className="text-base font-semibold text-black dark:text-white">
                  aevio
                </span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-md p-2 text-neutral-500 transition-colors hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-6">
              <div className="flex flex-col gap-2">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        "group flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-all duration-200",
                        pathname === item.href
                          ? "bg-neutral-100 dark:bg-white/10 text-black dark:text-white shadow-sm"
                          : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-8 items-center justify-center rounded-md transition-colors",
                            pathname === item.href
                              ? "bg-white dark:bg-black shadow-sm"
                              : "bg-neutral-100 dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-black group-hover:shadow-sm",
                          )}
                        >
                          <item.icon
                            size={16}
                            className={
                              pathname === item.href
                                ? "text-black dark:text-white"
                                : "text-neutral-500 group-hover:text-black dark:group-hover:text-white"
                            }
                          />
                        </div>
                        <span>{item.label}</span>
                      </div>
                      <div className="flex size-8 items-center justify-center rounded-md border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/5 transition-colors group-hover:bg-white dark:group-hover:bg-black">
                        <ChevronRight className="size-4 text-neutral-500 group-hover:text-black dark:group-hover:text-white" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mb-8 mt-auto flex flex-col gap-4 border-t border-black/10 dark:border-white/10 pt-6">
                {session?.user ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex flex-col gap-3"
                  >
                    <div className="rounded-lg border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/5 px-3 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary shrink-0">
                            {session?.user?.name?.charAt(0).toUpperCase() ||
                              "U"}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <p className="text-sm font-medium text-black dark:text-white truncate">
                              {session?.user?.name || "User"}
                            </p>
                            <p className="text-xs text-neutral-500 truncate">
                              {session?.user?.email}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer shrink-0"
                          title="Log out"
                        >
                          <LogOut size={14} />
                          <span>Log out</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <Link
                      href="/authentication"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-black dark:bg-white px-4 py-3 font-medium text-white dark:text-black transition-colors hover:bg-black/90 dark:hover:bg-white/90 cursor-pointer"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Log in
                    </Link>
                  </motion.div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
