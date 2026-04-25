"use client";

import { FormEvent, useEffect, useState } from "react";

type AgentApiResponse = {
  answer?: string;
  error?: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type AgentContextResponse = {
  exists?: boolean;
  coachContext?: {
    version?: number;
    source?: string | null;
    updatedAt?: string;
  };
  error?: string;
};

export default function AgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contextStatus, setContextStatus] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/agent/context");
        const data = (await res.json()) as AgentContextResponse;
        if (cancelled) {
          return;
        }
        if (!res.ok) {
          setContextStatus(
            data.error || "Could not load coach context (read-only).",
          );
          return;
        }
        if (data.exists && data.coachContext) {
          const { version, source, updatedAt } = data.coachContext;
          setContextStatus(
            `Stored coach context (v${version ?? "?"}${source ? `, ${source}` : ""})${updatedAt ? ` — updated ${new Date(updatedAt).toLocaleString()}` : ""}.`,
          );
        } else {
          setContextStatus(
            "No row yet — a full context is built on your first message.",
          );
        }
      } catch {
        if (!cancelled) {
          setContextStatus("Could not load coach context.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || isSending) {
      return;
    }

    setError(null);
    setIsSending(true);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setMessage("");

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = (await response.json()) as AgentApiResponse;
      if (!response.ok) {
        throw new Error(data.error || "Failed to get response from AI coach.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "No response received." },
      ]);

      const ctxRes = await fetch("/api/agent/context");
      const ctxData = (await ctxRes.json()) as AgentContextResponse;
      if (ctxRes.ok && ctxData.exists && ctxData.coachContext) {
        const { version, source, updatedAt } = ctxData.coachContext;
        setContextStatus(
          `Stored coach context (v${version ?? "?"}${source ? `, ${source}` : ""})${updatedAt ? ` — updated ${new Date(updatedAt).toLocaleString()}` : ""}.`,
        );
      }
    } catch (submitError) {
      const msg =
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while sending your message.";
      setError(msg);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-black dark:bg-black dark:text-white sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">AI Coach</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Each message uses your stored{" "}
          <code className="text-xs">CoachContext</code> from the database; first
          send builds it if missing.
        </p>

        {contextStatus ? (
          <p className="rounded-lg border border-black/10 bg-neutral-50 px-3 py-2 text-sm text-neutral-700 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
            {contextStatus}
          </p>
        ) : null}

        <div className="min-h-[280px] rounded-lg border border-black/10 bg-neutral-50 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col gap-3">
            {messages.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Start by asking something like: What should I focus on this
                week?
              </p>
            ) : (
              messages.map((entry, index) => (
                <div
                  key={`${entry.role}-${index}`}
                  className={
                    entry.role === "user"
                      ? "self-end max-w-[85%] rounded-md bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
                      : "self-start max-w-[85%] rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-black"
                  }
                >
                  {entry.content}
                </div>
              ))
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ask your AI coach..."
            className="h-24 w-full resize-none rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/10 dark:bg-black dark:focus:border-white/40"
          />
          <div className="flex items-center justify-between gap-3">
            {error ? (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            ) : (
              <span className="text-xs text-neutral-500">
                GET `/api/agent/context` · POST `/api/agent`
              </span>
            )}
            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
