"use client";

import { useOnboardingStore } from "@/lib/store/onboarding-store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Check, FileText, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

const consentSchema = z.object({
  consent: z.literal(true, {
    message: "You must consent to continue using Aevio.",
  }),
});

export function StepConsent() {
  const { data, updateData, setStep } = useOnboardingStore();

  const [consent, setConsent] = useState(data.consent || false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    const result = consentSchema.safeParse({ consent });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    updateData("consent", consent);
    setStep(7);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
          Your Privacy Matters
        </h2>
        <p className="text-lg text-muted-foreground">
          We value your trust and are committed to protecting your personal
          data.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 rounded-2xl border bg-card/50 space-y-4">
            <div className="p-3 w-fit rounded-xl bg-blue-500/10 text-blue-500">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold">Secure & Encrypted</h3>
            <p className="text-sm text-muted-foreground">
              Your data is encrypted at rest and in transit. We use
              industry-standard security measures.
            </p>
          </div>
          <div className="p-6 rounded-2xl border bg-card/50 space-y-4">
            <div className="p-3 w-fit rounded-xl bg-green-500/10 text-green-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold">You're in Control</h3>
            <p className="text-sm text-muted-foreground">
              You can export or delete your data at any time. We never sell your
              personal information.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border bg-primary/5 border-primary/10 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-background border shrink-0 mt-1">
              <FileText className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h4 className="font-medium">Data Usage & Personalization</h4>
              <p className="text-sm text-muted-foreground">
                To provide you with personalized health insights, workout
                recommendations, and habit tracking analysis, we need to process
                the data you've shared.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                By enabling this, you allow Aevio to analyze your inputs to
                generate tailored suggestions.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-primary/10">
            <label className="flex items-center gap-4 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    if (e.target.checked) setError(null);
                  }}
                  className="sr-only peer"
                />
                <div className="w-6 h-6 border-2 border-muted-foreground rounded-md peer-checked:bg-green-500 peer-checked:border-green-500 transition-all flex items-center justify-center">
                  <Check
                    className={cn(
                      "w-4 h-4 text-white transition-transform scale-0",
                      consent && "scale-100"
                    )}
                  />
                </div>
              </div>
              <div className="flex-1">
                <span
                  className={cn(
                    "font-medium transition-colors",
                    consent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  I consent to the processing of my health data for personalized
                  insights.
                </span>
              </div>
            </label>
            {error && (
              <p className="text-sm text-destructive mt-2 ml-10">{error}</p>
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Read our{" "}
            <a href="#" className="underline hover:text-primary">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-primary">
              Terms of Service
            </a>
            .
          </p>
        </div>
      </div>

      <div className="pt-8 flex justify-between">
        <button
          onClick={() => setStep(5)}
          className="px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-base font-medium text-white shadow-xl shadow-blue-600/25 transition-all hover:shadow-2xl hover:shadow-blue-600/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 cursor-pointer"
        >
          I Agree & Continue
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
