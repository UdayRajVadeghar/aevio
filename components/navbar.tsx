"use client";

import { ThemeToggle } from "@/components/ui/hero-section/theme-toggle";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ChevronRight, LogOut, Menu, User, X, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Analyze", href: "/analyze" },
  { label: "Journal", href: "/journal" },
  { label: "My Data", href: "/myData" },
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
      <header className="relative w-full border-b border-border/60 bg-background">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-1 py-1 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          >
            <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Zap size={16} fill="currentColor" />
            </div>
            <span className="text-base font-semibold tracking-tight text-foreground">
              Aevio
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
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
                  className="flex size-9 items-center justify-center rounded-md border border-border/60 bg-background text-foreground transition-colors hover:bg-muted cursor-pointer"
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
                      className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-lg border border-border/60 bg-background shadow-lg"
                    >
                      <div className="border-b border-border/60 px-4 py-3">
                        <p className="text-sm font-medium text-foreground">
                          {session.user.name || "User"}
                        </p>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-3 text-sm text-destructive transition-colors hover:bg-muted cursor-pointer"
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
                className="hidden rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90 sm:inline-flex"
              >
                Log in
              </Link>
            )}

            <button
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer md:hidden"
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
            className="fixed inset-0 z-[60] flex flex-col bg-background/95 p-6 backdrop-blur-xl"
          >
            <div className="mb-10 flex items-center justify-between border-b border-border/60 pb-4">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-md outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Zap size={16} fill="currentColor" />
                </div>
                <span className="text-base font-semibold text-foreground">Aevio</span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
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
                        "flex items-center justify-between rounded-lg px-4 py-3 text-base font-medium transition-colors",
                        pathname === item.href
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{item.label}</span>
                      <div className="flex size-8 items-center justify-center rounded-md border border-border/60 bg-background">
                        <ChevronRight className="size-5 text-foreground" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mb-8 mt-auto flex flex-col gap-4 border-t border-border/60 pt-6">
                {session?.user ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="rounded-lg border border-border/60 bg-muted/30 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-base font-semibold text-primary">
                          {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium text-foreground">
                            {session?.user?.name || "User"}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {session?.user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-destructive transition-colors hover:bg-destructive/10 cursor-pointer"
                    >
                      <LogOut size={18} />
                      Log out
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <Link
                      href="/authentication"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 font-medium text-background transition-colors hover:bg-foreground/90 cursor-pointer"
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
