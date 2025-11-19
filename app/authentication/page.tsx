"use client";

import { AuthInput } from "@/components/ui/auth-components/auth-input";
import { AuthLayout } from "@/components/ui/auth-components/auth-layout";
import {
  SocialAuthDivider,
  SocialButton,
} from "@/components/ui/auth-components/social-buttons";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthenticationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");

  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (viewParam === "signup") {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }
  }, [viewParam]);

  const toggleMode = () => {
    const newMode = !isSignUp;
    setIsSignUp(newMode);
    router.push(`/authentication?view=${newMode ? "signup" : "signin"}`, {
      scroll: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Redirect or handle success
    router.push("/dashboard");
  };

  return (
    <AuthLayout
      title={isSignUp ? "Create an account" : "Welcome back"}
      subtitle={
        isSignUp
          ? "Join Aevio to start tracking your high-performance metrics"
          : "Enter your credentials to access your journal"
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <SocialButton icon="github" label="GitHub" />
          <SocialButton icon="google" label="Google" />
        </div>

        <SocialAuthDivider />

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait" initial={false}>
            {isSignUp && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <AuthInput
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="mb-4"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AuthInput
            label="Email"
            type="email"
            placeholder="name@example.com"
            required
          />

          <div className="space-y-1">
            <AuthInput
              label="Password"
              type="password"
              placeholder="••••••••"
              required
            />
            {!isSignUp && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-end"
              >
                <button
                  type="button"
                  className="text-xs font-medium text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                >
                  Forgot password?
                </button>
              </motion.div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex items-center justify-center gap-2 h-11 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? "Create Account" : "Sign In"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={toggleMode}
            className="font-medium text-black dark:text-white hover:underline underline-offset-4 outline-none"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
