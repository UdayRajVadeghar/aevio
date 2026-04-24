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
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { data: session, isPending } = useSession();

  useEffect(() => {
    let rafId: number;
    let isThrottling = false;

    const handleScroll = () => {
      if (isThrottling) return;
      isThrottling = true;

      rafId = requestAnimationFrame(() => {
        if (window.scrollY > 50 && !isScrolled) {
          setIsScrolled(true);
        } else if (window.scrollY <= 50 && isScrolled) {
          setIsScrolled(false);
        }
        isThrottling = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isScrolled]);



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
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
        <header
          className={cn(
            "relative flex items-center justify-between px-6 py-4 w-full transition-all duration-300 pointer-events-auto",
            isScrolled
              ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
              : "bg-transparent border-b border-transparent"
          )}
        >
          {/* Logo — home */}
          <Link
            href="/"
            className="flex items-center gap-2 mr-4 cursor-pointer rounded-lg outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          >
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-lg tracking-tight whitespace-nowrap text-foreground">
              Aevio
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1 relative h-10">
            <nav className="flex items-center gap-1 h-full">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors cursor-pointer"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-4">
            <ThemeToggle />

            {session?.user ? (
              // Logged in: Show user menu
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer size-10"
                >
                  <User size={20} />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && session?.user && (
                  <div className="absolute top-full right-0 mt-2 w-56 p-2 bg-background/90 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-border/50">
                      <p className="text-sm font-medium text-foreground">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 mt-1 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut size={16} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Not logged in: Show login/signup buttons
              <>
                <Link
                  href="/authentication"
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap cursor-pointer"
                >
                  Log in
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </header>
      </div>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-2xl p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-12">
              <Link
                href="/"
                className="flex items-center gap-2 cursor-pointer rounded-lg outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                  <Zap size={18} fill="currentColor" />
                </div>
                <span className="font-bold text-lg text-foreground">Aevio</span>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-muted/50 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-6 flex-1">
              <div className="flex flex-col gap-4">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                  >
                    <Link
                      href={item.href}
                      className="group flex items-center justify-between text-2xl font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="size-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-6 mb-8">
                {session?.user ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="px-5 py-4 bg-muted/40 backdrop-blur-xl border border-border/50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                          {session?.user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                        <div className="flex flex-col">
                          <p className="text-base font-medium text-foreground">
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
                      className="flex items-center justify-center w-full gap-2 px-4 py-3 bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium rounded-xl transition-colors cursor-pointer"
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
                      className="flex items-center justify-center w-full gap-2 px-4 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
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
