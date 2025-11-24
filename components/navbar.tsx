"use client";

import { ThemeToggle } from "@/components/ui/hero-section/theme-toggle";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ChevronRight, LogOut, Menu, User, X, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "Workout", href: "/workout" },
  { label: "About", href: "#about" },
  { label: "Blog", href: "#blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCompactMenuOpen, setIsCompactMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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

  // Early return after all hooks have been called
  if (pathname?.startsWith("/onboarding") || pathname?.startsWith("/authentication")) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
        <header
          className={cn(
            "relative flex items-center justify-between px-4 py-3 backdrop-blur-md border transition-all duration-300 pointer-events-auto",
            isScrolled
              ? "bg-background/80 border-border/50 shadow-lg rounded-full w-auto max-w-[800px]"
              : "bg-transparent border-transparent rounded-2xl w-full max-w-[1200px]"
          )}
        >
          {/* Logo */}
          <div className="flex items-center gap-2 mr-4">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Zap size={18} fill="currentColor" />
            </div>
            {!isScrolled && (
              <span className="font-bold text-lg tracking-tight whitespace-nowrap">
                Aevio
              </span>
            )}
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-1 relative h-10">
            {isScrolled ? (
              // Compact Mode: Show "Menu" trigger
              <div className="relative flex items-center justify-center w-full h-full">
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
                {isCompactMenuOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 p-2 bg-background/90 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl flex flex-col gap-1 overflow-hidden">
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
                  </div>
                )}
              </div>
            ) : (
              // Expanded Mode: Show full list
              <nav className="flex items-center gap-1 h-full">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 ml-4">
            <ThemeToggle />

            {session?.user ? (
              // Logged in: Show user menu
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={cn(
                    "flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
                    isScrolled ? "size-9" : "size-10"
                  )}
                >
                  <User size={isScrolled ? 18 : 20} />
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
                      className="w-full flex items-center gap-2 px-4 py-2 mt-1 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
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
                {!isScrolled && (
                  <Link
                    href="/authentication"
                    className="hidden sm:block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                  >
                    Log in
                  </Link>
                )}
                <Link
                  href="/authentication"
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors whitespace-nowrap",
                    isScrolled ? "px-5" : "px-4"
                  )}
                >
                  Get Started
                </Link>
              </>
            )}

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
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl p-6 flex flex-col">
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
                    {session?.user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session?.user?.email}
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
        </div>
      )}
    </>
  );
}
