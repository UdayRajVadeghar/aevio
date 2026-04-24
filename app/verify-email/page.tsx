"use client";

import { AuthInput } from "@/components/ui/auth-components/auth-input";
import { AuthLayout } from "@/components/ui/auth-components/auth-layout";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

type VerificationState = "idle" | "verifying" | "verified" | "error";

function getErrorMessageFromCode(code: string) {
  switch (code) {
    case "TOKEN_EXPIRED":
      return "This verification link has expired. Request a new one below.";
    case "INVALID_TOKEN":
      return "This verification link is invalid. Request a fresh email below.";
    case "USER_NOT_FOUND":
      return "We could not find an account for this verification link.";
    case "EMAIL_ALREADY_VERIFIED":
      return "This email is already verified. You can sign in now.";
    default:
      return "We could not verify your email. Please try again or request a new link.";
  }
}

function getErrorMessageFromResponse(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return "Email verification failed. Please try again.";
  }

  const maybePayload = payload as { code?: unknown; message?: unknown };
  if (typeof maybePayload.code === "string") {
    return getErrorMessageFromCode(maybePayload.code);
  }

  if (typeof maybePayload.message === "string" && maybePayload.message.trim()) {
    return maybePayload.message;
  }

  return "Email verification failed. Please try again.";
}

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const initialEmail = searchParams.get("email")?.trim() ?? "";
  const urlErrorCode = searchParams.get("error")?.trim() ?? "";

  const [verificationState, setVerificationState] =
    useState<VerificationState>(urlErrorCode ? "error" : "idle");
  const [verificationMessage, setVerificationMessage] = useState(
    urlErrorCode ? getErrorMessageFromCode(urlErrorCode) : ""
  );
  const [resendEmail, setResendEmail] = useState(initialEmail);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");

  const isMissingToken = useMemo(() => token.length === 0, [token]);

  const verifyEmail = async () => {
    if (!token) {
      setVerificationState("error");
      setVerificationMessage(
        "This verification link is missing required details. Request a new verification email below."
      );
      return;
    }

    setVerificationState("verifying");
    setVerificationMessage("");
    setResendError("");
    setResendMessage("");

    try {
      const response = await fetch(
        `/api/auth/verify-email?token=${encodeURIComponent(token)}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const payload = (await response.json().catch(() => null)) as unknown;

      if (!response.ok) {
        setVerificationState("error");
        setVerificationMessage(getErrorMessageFromResponse(payload));
        return;
      }

      setVerificationState("verified");
      setVerificationMessage(
        "Your email is verified. Open the app and sign in to continue."
      );
    } catch (error) {
      console.error("[verify-email] Verification request failed", error);
      setVerificationState("error");
      setVerificationMessage(
        "Network issue while verifying your email. Please try again."
      );
    }
  };

  const resendVerificationEmail = async () => {
    const email = resendEmail.trim();
    if (!email) {
      setResendError("Enter your email address to resend verification.");
      setResendMessage("");
      return;
    }

    setIsResending(true);
    setResendError("");
    setResendMessage("");

    try {
      await authClient.$fetch("/send-verification-email", {
        method: "POST",
        body: {
          email,
          callbackURL: "/authentication?view=signin",
        },
      });
      setResendMessage(
        "Verification email sent. Open the latest email and tap Verify Email."
      );
    } catch (error) {
      console.error("[verify-email] Failed to resend verification", error);
      setResendError(
        "Failed to resend verification email. Please double-check the address and try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Confirm your email securely before signing in."
    >
      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            On mobile, your email app may open links in another browser. That is
            okay. Verify here, then open the app and sign in.
          </p>
        </div>

        {verificationMessage && (
          <div
            className={`p-3 rounded-lg border ${
              verificationState === "verified"
                ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
            }`}
          >
            <p
              className={`text-sm ${
                verificationState === "verified"
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {verificationMessage}
            </p>
          </div>
        )}

        {verificationState !== "verified" && (
          <button
            type="button"
            onClick={verifyEmail}
            disabled={verificationState === "verifying" || isMissingToken}
            className="w-full h-11 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {verificationState === "verifying"
              ? "Verifying..."
              : "Verify Email Now"}
          </button>
        )}

        {verificationState === "verified" && (
          <Link
            href="/authentication?view=signin"
            className="flex items-center justify-center w-full h-11 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-medium"
          >
            Open app and sign in
          </Link>
        )}

        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Link expired or already used? Request a fresh verification email.
          </p>

          <AuthInput
            label="Email"
            type="email"
            value={resendEmail}
            onChange={(event) => setResendEmail(event.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
          />

          {resendError && (
            <p className="text-sm text-red-600 dark:text-red-400">{resendError}</p>
          )}

          {resendMessage && (
            <p className="text-sm text-green-700 dark:text-green-300">
              {resendMessage}
            </p>
          )}

          <button
            type="button"
            onClick={resendVerificationEmail}
            disabled={isResending}
            className="w-full h-11 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isResending ? "Sending..." : "Resend verification email"}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
