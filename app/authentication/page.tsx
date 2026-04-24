"use client";

import { AuthInput } from "@/components/ui/auth-components/auth-input";
import { AuthLayout } from "@/components/ui/auth-components/auth-layout";
import { authClient } from "@/lib/auth-client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function AuthenticationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewParam = searchParams.get("view");

  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      if (isSignUp) {
        // Sign up - will send verification email automatically
        const result = await authClient.signUp.email({
          email,
          password,
          name,
        });

        if (result.error) {
          setError(result.error.message || "Failed to create account");
        } else {
          setSuccess(
            "Account created! Please check your email to verify your account."
          );
          // Don't redirect, let user know to check email
        }
      } else {
        // Sign in with email and password
        const result = await authClient.signIn.email({
          email,
          password,
        });

        if (result.error) {
          setError(result.error.message || "Failed to sign in");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = prompt("Enter your email address:");
    if (!email) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await authClient.$fetch("/forget-password", {
        method: "POST",
        body: {
          email,
          redirectTo: "/authentication/reset-password",
        },
      });
      setSuccess("Password reset link sent! Please check your email.");
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
      console.error("Forgot password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={isSignUp ? "Create an account" : "Welcome back"}
      subtitle={
        isSignUp
          ? "Join Aevio to start tracking your nutrition"
          : "Enter your credentials to access your account"
      }
    >
      <div className="space-y-3 sm:space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-600 dark:text-green-400">
                {success}
              </p>
            </div>
          )}

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
                  name="name"
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
            name="email"
            placeholder="name@example.com"
            required
          />

          <div className="space-y-1">
            <AuthInput
              label="Password"
              type="password"
              name="password"
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
                  onClick={handleForgotPassword}
                  className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors duration-200 py-1 px-2 rounded-md"
                >
                  Forgot password?
                </button>
              </motion.div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex items-center justify-center gap-2 h-12 sm:h-11 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium text-base sm:text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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

        <div className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-4 sm:mt-6">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={toggleMode}
            className="font-medium text-black dark:text-white hover:underline underline-offset-4 outline-none hover:bg-neutral-100 dark:hover:bg-white/10 rounded-md px-2 py-1 transition-colors duration-200"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function AuthenticationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthenticationContent />
    </Suspense>
  );
}
