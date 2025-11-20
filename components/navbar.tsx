"use client";

import { ThemeToggle } from "@/components/ui/hero-section/theme-toggle";
import { signOut, useSession } from "@/lib/auth-client";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { ChevronRight, Menu, X, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
  { label: "Blog", href: "#blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCompactMenuOpen, setIsCompactMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { data: session, isPending } = useSession();

  if (pathname?.startsWith("/onboarding")) {
    return null;
  }

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > 50 && !isScrolled) {
      setIsScrolled(true);
    } else if (latest <= 50 && isScrolled) {
      setIsScrolled(false);
    }
  });

  const handleLogout = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  const springTransition = {
    type: "spring" as const,
    stiffness: 80,
    damping: 15,
    mass: 1,
  };

  return (
    <LayoutGroup>
      <div className="absolute top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
        <header className="relative flex items-center justify-between px-4 py-3 w-full max-w-[1200px] rounded-2xl pointer-events-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 mr-4">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-lg tracking-tight">Aevio</span>
          </div>

          {/* Desktop Nav Items */}
          <motion.div
            layout
            className="hidden md:flex items-center gap-1 relative h-10"
            transition={springTransition}
          >
            <AnimatePresence mode="popLayout">
              {isScrolled ? (
                // Compact Mode: Show "Menu" trigger
                <motion.div
                  key="compact-menu"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={springTransition}
                  className="relative flex items-center justify-center w-full h-full"
                >
                  <button
                    onClick={() => setIsCompactMenuOpen(!isCompactMenuOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-full hover:bg-muted/50 transition-colors"
                  >
                    Menu
                    <ChevronRight
                      className={cn(
                        "size-4 transition-transform duration-300",
                        isCompactMenuOpen && "rotate-90"
                      )}
                    />
                  </button>

                  {/* Compact Dropdown */}
                  <AnimatePresence>
                    {isCompactMenuOpen && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 10,
                          scale: 0.95,
                          filter: "blur(10px)",
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          filter: "blur(0px)",
                        }}
                        exit={{
                          opacity: 0,
                          y: 10,
                          scale: 0.95,
                          filter: "blur(10px)",
                        }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 p-2 bg-background/90 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl flex flex-col gap-1 overflow-hidden"
                      >
                        {navItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            onClick={() => setIsCompactMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                // Expanded Mode: Show full list
                <motion.nav
                  key="expanded-nav"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={springTransition}
                  className="flex items-center gap-1 h-full"
                >
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </motion.nav>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-4">
            <ThemeToggle />
            <AnimatePresence>
              {!isScrolled && (
                <motion.div
                  initial={{ opacity: 0, width: 0, x: 10 }}
                  animate={{ opacity: 1, width: "auto", x: 0 }}
                  exit={{ opacity: 0, width: 0, x: 10 }}
                  transition={springTransition}
                  className="overflow-hidden"
                >
                  <Link
                    href="/login"
                    className="hidden sm:block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                  >
                    Log in
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <Link
              href="/signup"
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors whitespace-nowrap",
                isScrolled ? "px-5" : "px-4"
              )}
            >
              Get Started
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl p-6 flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                  <Zap size={18} fill="currentColor" />
                </div>
                <span className="font-bold text-lg">Aevio</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 bg-muted rounded-full text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-2xl font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <hr className="border-border my-4" />

              {session?.user ? (
                // Logged in: Show user info and logout
                <>
                  <div className="px-4 py-3 bg-muted/30 rounded-lg">
                    <p className="text-sm font-medium text-foreground">
                      {session.user.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 text-xl font-medium text-destructive hover:text-destructive/80 transition-colors"
                  >
                    <LogOut size={20} />
                    Log out
                  </button>
                </>
              ) : (
                // Not logged in: Show login/signup
                <>
                  <Link
                    href="/authentication"
                    className="text-xl font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/authentication"
                    className="text-xl font-medium text-primary hover:text-primary/80 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}
