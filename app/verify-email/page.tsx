import { Suspense } from "react";
import VerifyEmailClientPage from "./verify-email-client";

function VerifyEmailFallback() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-4">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Loading verification page...
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailClientPage />
    </Suspense>
  );
}
